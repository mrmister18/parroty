const client = require('../client');

module.exports = {
    createParrot,
    deleteParrot,
    getParrotsBySquawkId,
    getParrotsByUserId
}

async function createParrot({
    userId,
    squawkId
}) {
    const { rows: [parrot] } = await client.query(`
        INSERT INTO parrots ("userId", "squawkId")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, squawkId])
    return parrot
}

async function deleteParrot({
    userId,
    squawkId
}) {
    const { rows: [parrot] } = await client.query(`
        DELETE FROM parrots
        WHERE "userId" = $1 
        AND "squawkId" = $2
        RETURNING *;
    `, [userId, squawkId])
    return parrot
}

async function getParrotsBySquawkId(squawkId) {
    const { rows } = await client.query(`
        SELECT * FROM parrots
        WHERE "squawkId" = $1;
    `, [squawkId])
    return rows
}

async function getParrotsByUserId(userId) {
    const { rows } = await client.query(`
        SELECT * FROM parrots
        WHERE "userId" = $1;
    `, [userId])
    return rows
}