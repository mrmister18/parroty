const { getAllSquawks, attachInfoToSquawks, createSquawk, deleteSquawk, getSquawkById } = require("../db");
const { requireUser } = require("./utilities");

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

apiRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id
        const { squawkContent } = req.body;
        const squawk = await createSquawk({userId, squawkContent})
        const response = {
            squawk: squawk,
            message: "Squawk successfully posted!"
        }
        res.send(response);
    } catch (error) {
        next(error)
    }
})

apiRouter.delete('/:squawkId', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id
        const { squawkId } = req.params
        const squawk = await getSquawkById(squawkId)
        if (squawk.userId === userId) {
        const deletedSquawk = await deleteSquawk({userId, squawkId})
        res.send({message: "Squawk deleted successfully", squawk: deletedSquawk})}
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter;