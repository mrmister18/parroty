const client = require('../client');

module.exports = {
    createFollower,
    deleteFollower,
    getFollowersById,
    getFollowersByFollowerId
}

async function createFollower({
    userId,
    followerId
}) {
    const { rows: [follower] } = await client.query(`
        INSERT INTO followers ("userId", "followerId")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, followerId])
    return follower
}

async function deleteFollower({
    userId,
    followerId
}) {
    const { rows: [follower] } = await client.query(`
        DELETE FROM followers
        WHERE "userId" = $1 AND "followerId" = $2
        RETURNING *;
    `, [userId, followerId])
    return follower
}

async function getFollowersById(userId) {
    const { rows } = await client.query(`
        SELECT * FROM followers
        WHERE "userId" = $1;
    `, [userId])
    return rows
}

async function getFollowersByFollowerId(followerId) {
    const { rows } = await client.query(`
        SELECT * FROM followers
        WHERE "followerId" = $1;
    `, [followerId])
    return rows
}