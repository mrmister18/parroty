const client = require('../client');

module.exports = {
    createMessage,
    getAllMessagesByUser
}

async function createMessage({
    sender,
    receiver,
    messageContent
}) {
    const { rows: [message] } = await client.query(`
        INSERT INTO messages (sender, receiver, "messageContent")
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [sender, receiver, messageContent])
    return message
}

async function getAllMessagesByUser(userId) {
    const { rows } = await client.query(`
        SELECT * FROM messages
        WHERE receiver = ${userId}
        OR sender = ${userId};`)
    return rows
}