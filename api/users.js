const apiRouter = require("express").Router();

const {
  getUserById,
  getFollowersByFollowerId,
  getFollowersById,
  getSquawksByUserId,
  getAllMessagesByUser,
} = require("../db");

apiRouter.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    user.followers = await getFollowersById(userId);
    user.following = await getFollowersByFollowerId(userId);
    user.squawks = await getSquawksByUserId(userId);
    user.messages = await getAllMessagesByUser(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;