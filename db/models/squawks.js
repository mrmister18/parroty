const client = require('../client');

module.exports = {
    createSquawk
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