const { getAllSquawks, attachInfoToSquawks, createSquawk, deleteSquawk } = require("../db");

const apiRouter = require("express").Router();

apiRouter.get('/', async (req, res, next) => {
    try {
        const squawks = await getAllSquawks()
        await attachInfoToSquawks(squawks)
        res.send(squawks)
    } catch (error) {
        next(error)
    }
})

apiRouter.post('/', async (req, res, next) => {
    try {
        const { userId, squawkContent } = req.body;
        const squawk = await createSquawk({userId, squawkContent})
        res.send(squawk);
    } catch (error) {
        next(error)
    }
})

apiRouter.delete('/:squawkId', async (req, res, next) => {
    try {
        const { squawkId } = req.body
        const squawk = await deleteSquawk(squawkId)
        res.send(squawk)
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter;