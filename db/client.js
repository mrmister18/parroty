// Connect to DB
const { Client } = require('pg');

// change the DB_NAME string to whatever your group decides on
const DB_NAME = 'parroty';

const DB_URL = 'postgres://mrmister18:5MOalYjXABggxxXeTnGQ8pIgcu87NpM1@dpg-cha2ik3hp8u791kf9g6g-a/parroty'
  // process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

let client;

// github actions client config
// if (process.env.CI) {
//   client = new Client({
//     host: 'localhost',
//     port: 5432,
//     user: 'postgres',
//     password: 'postgres',
//     database: 'postgres',
//   });
// } else {
  // local / heroku client config
  client = new Client(DB_URL);
// }

module.exports = client;
