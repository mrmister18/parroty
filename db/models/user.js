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
  attachInfoToUsers,
  updateUser
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
  ...fields
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const setKeys = Object.keys(fields)
    .map((key) => `"${key}"`)
    .join(", ");

    const setIndexes = Object.keys(fields)
    .map((key, index) => `$${index + 4}`)
    .join(", ");

    let arr = [username, hashedPassword, name].concat(Object.values(fields))

  const {
    rows: [user],
  } = await client.query(
    `
  INSERT INTO users (username, password, name, ${setKeys})
  VALUES ($1, $2, $3, ${setIndexes})
  RETURNING *;
  `,
    arr
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

async function updateUser({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  const {
    rows: [user],
  } = await client.query(
    `
    UPDATE users
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
    Object.values(fields)
  );

  return user;
}