const client = require('../client');

module.exports = {
    createComment
}

async function createComment({
    squawkId,
    userId,
    commentContent
}) {
    const { rows: [comment] } = await client.query(`
        INSERT INTO comments ("squawkId", "userId", "commentContent")
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [squawkId, userId, commentContent])
    return comment
}