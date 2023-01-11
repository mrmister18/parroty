const apiRouter = require("express").Router();

const {
    createMessage
} = require('../db');
const { requireUser } = require("./utilities");

apiRouter.post('/:receiver', requireUser, async (req, res, next) => {
    try {
        const { receiver } = req.params;
        const sender = req.user.id;
        const { messageContent } = req.body;
        const createdMessage = await createMessage({sender, receiver, messageContent})
        const response = {
            message: "Message successfully created",
            createdMessage
        }
        res.send(response)
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter