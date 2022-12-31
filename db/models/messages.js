const client = require('../client');

module.exports = {
    createMessage
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