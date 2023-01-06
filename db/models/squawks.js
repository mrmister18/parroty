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
    getSquawkById
}

async function createSquawk({
    userId,
    squawkContent
}) {
    const { rows: [squawk] } = await client.query(`
        INSERT INTO squawks ("userId", "squawkContent")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, squawkContent])
    return squawk
}

async function deleteSquawk(userId) {
    const { rows: [squawk] } = await client.query(`
        DELETE FROM squawks
        WHERE userId = $1;
    `, [userId])
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

async function getSquawkById(id) {
    const { rows: [squawk] } = await client.query(`
        SELECT * FROM squawks
        WHERE id = $1;
    `, [id])
    return squawk
}