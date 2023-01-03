const { getFollowersById, getFollowersByFollowerId } = require('../db/models/followers');
const { getAllMessagesByUser } = require('../db/models/messages');
const { getSquawksByUserId } = require('../db/models/squawks');
const { getUserById } = require('../db/models/user');

const apiRouter = require('express').Router();

apiRouter.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await getUserById(userId)
        user.followers = await getFollowersById(userId)
        user.following = await getFollowersByFollowerId(userId)
        user.squawks = await getSquawksByUserId(userId)
        user.messages = await getAllMessagesByUser(userId)
        res.send(user)
    } catch (error) {
        next(error);
    }
})

module.exports = apiRouter;