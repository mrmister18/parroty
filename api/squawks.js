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
        const { userId } = req.user.id
        const { squawkContent } = req.body;
        const squawk = await createSquawk({userId, squawkContent})
        res.send(squawk);
    } catch (error) {
        next(error)
    }
})

apiRouter.delete('/:squawkId', async (req, res, next) => {
    try {
        const { userId } = req.user.id
        const { squawkId } = req.params
        const squawk = await getSquawkById(squawkId)
        if (squawk.userId === userId) {
        await deleteSquawk(squawkId)}
        res.send({message: "Squawk deleted successfully"})
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter;