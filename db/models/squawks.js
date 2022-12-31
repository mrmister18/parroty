const client = require('../client');

module.exports = {
    createSquawk,
    deleteSquawk
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
        WHERE userId = $1
        RETURNING *;
    `, [userId])
    return squawk
}