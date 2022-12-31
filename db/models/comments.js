const client = require('../client');

module.exports = {
    createComment,
    getCommentsBySquawkId,
    deleteComment,
    updateComment
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

async function getCommentsBySquawkId(squawkId) {
    const { rows } = await client.query(`
        SELECT * FROM comments
        WHERE "squawkId" = ($1);
    `, [squawkId])
    return rows
}

async function deleteComment(id) {
    const {
      rows: [comment],
    } = await client.query(
      `
      DELETE FROM comments
      WHERE id=$1
      RETURNING *;
      `,
      [id]
    );
  
    return comment;
  }

async function updateComment({id, commentContent}) {
    const { rows: [comment] } = await client.query(`
        UPDATE comments
        SET "commentContent" = ($1)
        WHERE id = ${id};
    `, [commentContent])
    return comment
}