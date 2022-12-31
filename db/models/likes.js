const client = require('../client');

module.exports = {
    createLike,
    deleteLike,
    getLikesBySquawkId,
    getLikesByUserId
}

async function createLike({
    userId,
    squawkId
}) {
    const { rows: [like] } = await client.query(`
        INSERT INTO likes ("userId", "squawkId")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, squawkId])
    return like
}

async function deleteLike({
    userId,
    squawkId
}) {
    const { rows: [like] } = await client.query(`
        DELETE FROM likes
        WHERE "userId" = $1 AND "squawkId" = $2
        RETURNING *;
    `, [userId, squawkId])
    return like
}

async function getLikesBySquawkId(squawkId) {
    const { rows } = await client.query(`
        SELECT * FROM likes
        WHERE "squawkId" = $1;
    `, [squawkId])
    return rows
}

async function getLikesByUserId(userId) {
    const { rows } = await client.query(`
        SELECT * FROM likes
        WHERE "userId" = $1;
    `, [userId])
    return rows
}