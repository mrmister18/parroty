// grab our db client connection to use with our adapters
const client = require('../client');
const bcrypt = require('bcryptjs');
const { getFollowersById, getFollowersByFollowerId } = require('./followers');
const { getSquawksByUserId, deleteSquawk } = require('./squawks');

module.exports = {
  // add your database adapter fns here
  getAllUsers,
  createUser,
  getUserById,
  getUserByUsername,
  getUser,
  deleteUser,
  attachInfoToUsers
};

async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
  const { rows } = await client.query(`SELECT * FROM users`)
  return rows
}

async function createUser({
  username,
  password,
  name,
  bio
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await client.query(
    `
  INSERT INTO users (username, password, name, bio)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `,
    [username, hashedPassword, name, bio]
  );

  delete user.password;

  return user;
}

async function getUserById(id) {
  const {
    rows: [user],
  } = await client.query(
    `
  SELECT * FROM users
  WHERE id=$1;
  `,
    [id]
  );

  return user;
}

async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await client.query(
    `
  SELECT * FROM users
  WHERE username=$1;
  `,
    [username]
  );

  return user;
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;

    const isValid = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser({ userId, password }) {
  try {
    const user = await getUserById(userId);
    const hashedPassword = user.password;

    const isValid = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      await client.query(`
        DELETE FROM parrots
        WHERE "userId" = ${user.id};
        DELETE FROM likes
        WHERE "userId" = ${user.id};
        DELETE FROM followers
        WHERE "userId" = ${user.id};
        OR "followerId" = ${user.id};
        DELETE FROM messages
        WHERE sender = ${user.id}
        OR receiver = ${user.id};
        DELETE FROM comments
        WHERE "userId" = ${user.id};
        DELETE FROM users
        WHERE id = ${user.id};
      `)
      const squawks = await getSquawksByUserId(user.id);
      await Promise.all(squawks.map(deleteSquawk))
    }
  } catch (error) {
    console.error(error);
  }
}

async function attachInfoToUsers(users) {
  for ( let i = 0; i < users.length; i++) {
    users[i].followers = await getFollowersById(users[i].id);
    users[i].following = await getFollowersByFollowerId(users[i].id);
    users[i].squawks = await getSquawksByUserId(users[i].id);
    delete users[i].password}
      return users
}