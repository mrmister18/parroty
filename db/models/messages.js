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
        let chats = {}
        for (let i = 0; i < rows.length; i++) {
            if (chats[rows[i].sender] && rows[i].sender !== userId) {
                chats[rows[i].sender].push(rows[i])
              } else if (chats[rows[i].receiver] && rows[i].receiver !== userId) {
                chats[rows[i].receiver].push(rows[i])
              } else if (!chats[rows[i].receiver] && rows[i].receiver !== userId) {
                chats[rows[i].receiver] = [rows[i]]
              } else if (!chats[rows[i].sender] && rows[i].sender !== userId) {
                chats[rows[i].sender] = [rows[i]]
              }
        }
    return Object.values(chats)
}