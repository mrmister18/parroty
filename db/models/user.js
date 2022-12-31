// grab our db client connection to use with our adapters
const client = require('../client');
const bcrypt = require('bcryptjs');

module.exports = {
  // add your database adapter fns here
  getAllUsers,
  createUser
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
