const client = require('../client');
const { getCommentsBySquawkId } = require('./comments');
const { getLikesBySquawkId } = require('./likes');
const { getParrotsBySquawkId } = require('./parrots');

module.exports = {
    createSquawk,
    deleteSquawk,
    getSquawksByUserId,
    getAllSquawks,
    attachInfoToSquawks,
    getSquawkById,
    attachAuthorsToSquawks,
    updateSquawk
}

async function createSquawk({
    userId,
    ...fields
}) {
    const setKeys = Object.keys(fields)
    .map((key) => `"${key}"`)
    .join(", ");

    const setIndexes = Object.keys(fields)
    .map((key, index) => `$${index + 2}`)
    .join(", ");

    let arr = [userId].concat(Object.values(fields))

    const { rows: [squawk] } = await client.query(`
        INSERT INTO squawks ("userId", ${setKeys})
        VALUES ($1, ${setIndexes})
        RETURNING *;
    `, arr)
    squawk.comments = await getCommentsBySquawkId(squawk.id)
        squawk.likes = await getLikesBySquawkId(squawk.id)
        squawk.parrots = await getParrotsBySquawkId(squawk.id)
        const { rows: [author] } = await client.query(`
        SELECT squawks."userId", users.username, users.name, users."profilePicture"
        FROM squawks
        JOIN users
        ON squawks."userId" = users.id
        WHERE squawks.id = ${squawk.id};
        `)
        squawk.author = author
    return squawk
}

async function deleteSquawk({userId, squawkId}) {
    await client.query(`
        DELETE FROM likes
        WHERE "squawkId" = ${squawkId};
        DELETE FROM comments
        WHERE "squawkId" = ${squawkId};
        DELETE FROM parrots
        WHERE "squawkId" = ${squawkId};
        DELETE FROM squawks
        WHERE "userId" = ${userId}
        AND id = ${squawkId};
    `)
}

async function getSquawksByUserId(userId) {
    const { rows } = await client.query(`
        SELECT * FROM squawks
        WHERE "userId" = $1;
    `, [userId])
    return rows
}

async function getAllSquawks() {
    const { rows } = await client.query(`
        SELECT * FROM squawks;
    `)
    return rows
}

async function attachInfoToSquawks(squawks) {
    for ( let i = 0; i < squawks.length; i++) {
        squawks[i].comments = await getCommentsBySquawkId(squawks[i].id)
        squawks[i].likes = await getLikesBySquawkId(squawks[i].id)
        squawks[i].parrots = await getParrotsBySquawkId(squawks[i].id)}
        return squawks
}

async function attachAuthorsToSquawks(squawks) {
    for ( let i = 0; i < squawks.length; i++) {
        const { rows: [author] } = await client.query(`
        SELECT squawks."userId", users.username, users.name, users."profilePicture"
        FROM squawks
        JOIN users
        ON squawks."userId" = users.id
        WHERE squawks.id = ${squawks[i].id};
        `)
        squawks[i].author = author
        }
        return squawks
}

async function getSquawkById(id) {
    const { rows: [squawk] } = await client.query(`
        SELECT * FROM squawks
        WHERE id = $1;
    `, [id])
    return squawk
}

async function updateSquawk({ id, ...fields }) {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
  
    if (setString === 0) {
      return;
    }
  
    const {
      rows: [squawk],
    } = await client.query(
      `
      UPDATE squawks
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );
  
    return squawk;
  }