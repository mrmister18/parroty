const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRET } = process.env;

const {
  getUserById,
  getFollowersByFollowerId,
  getFollowersById,
  getSquawksByUserId,
  getAllMessagesByUser,
  createUser,
  getUser,
  getAllUsers,
  attachInfoToUsers,
  deleteUser
} = require("../db");

apiRouter.get('/', async (req, res, next) => {
  try {
    const users = await getAllUsers()
    await attachInfoToUsers(users)
    res.send(users)
  } catch (error) {
    next(error);
  }
})

apiRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {throw Error("Missing jwt token")}
    const { userId } = req.user.id;
    const user = await getUserById(userId);
    delete user.password
    user.followers = await getFollowersById(userId);
    user.following = await getFollowersByFollowerId(userId);
    user.squawks = await getSquawksByUserId(userId);
    user.messages = await getAllMessagesByUser(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/register', async (req, res, next) => {
  try {
      const { username, password, name, bio } = req.body;
      // if (await getUserByUsername(username)) {throw Error('This username already exists')}
      const user = await createUser({username, password, name, bio})
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET)
      const response = {user: user, message: "Successfully created a new user", token: token}
      res.send(response);
  } catch (error) {
      next(error)
  }
})

apiRouter.post('/login', async (req, res, next) => {
  try {
      const { username, password } = req.body;
      const user = await getUser({username, password})
      if (!user) {throw Error('Invalid username or password')}
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET)
      const response = {user: user, message: "Successfully logged in", token: token}
      res.send(response);
  } catch (error) {
      next(error)
  }
})

apiRouter.delete('/:userId', async (req, res, next) => {
  try {
    const {password} = req.body
    const {userId} = req.params
    const user = await deleteUser({userId, password})
    res.send(user)
  } catch (error) {
    next(error)
  }
})

module.exports = apiRouter;