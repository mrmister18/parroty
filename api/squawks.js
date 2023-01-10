const { getAllSquawks, attachInfoToSquawks, createSquawk, deleteSquawk, getSquawkById, createComment, createLike, deleteLike } = require("../db");
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

apiRouter.post('/:squawkId/comment', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id
        const { commentContent } = req.body;
        const { squawkId } = req.params;
        const comment = await createComment({userId, commentContent, squawkId})
        const response = {
            comment: comment,
            message: "Comment successfully posted!"
        }
        res.send(response);
    } catch (error) {
        next(error)
    }
})

apiRouter.post('/:squawkId/like', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id
        const { squawkId } = req.params;
        const like = await createLike({userId, squawkId})
        const response = {
            like: like,
            message: "Comment successfully posted!"
        }
        res.send(response);
    } catch (error) {
        next(error)
    }
})

apiRouter.delete('/:squawkId/like', requireUser, async (req, res, next) => {
    try {
        const userId = req.user.id
        const { squawkId } = req.params;
        await deleteLike({userId, squawkId})
        const response = {
            message: "Comment successfully deleted!"
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
        await deleteSquawk({userId, squawkId})
        res.send({message: "Squawk deleted successfully"})} else {
            throw Error("User is not allowed to delete someone else's squawk")
        }
    } catch (error) {
        next(error)
    }
})

module.exports = apiRouter;