const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
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
  deleteUser,
  getUserByUsername,
  createFollower,
  deleteFollower,
  updateUser
} = require("../db");

const { requireUser } = require('./utilities')

apiRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    await attachInfoToUsers(users);
    res.send(users);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/:username", async (req, res, next) => {
  try {
    const {username} = req.params
    const user = await getUserByUsername(username);
    await attachInfoToUsers([user]);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/me", requireUser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    delete user.password;
    user.followers = await getFollowersById(userId);
    user.following = await getFollowersByFollowerId(userId);
    user.squawks = await getSquawksByUserId(userId);
    user.messages = await getAllMessagesByUser(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, name, bio, profilePicture } = req.body;
    const fields = { bio, profilePicture }
    if (await getUserByUsername(username)) {
      throw Error("This username already exists");
    }
    const user = await createUser({ username, password, name, ...fields });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    const response = {
      user,
      message: "Successfully created a new user",
      token
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username, password });
    if (!user) {
      throw Error("Invalid username or password");
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET
    );
    const response = {
      user,
      message: "Successfully logged in",
      token: token,
    };
    res.send(response);
  } catch (error) {
    next(error);
  }
});

apiRouter.delete("/:userId", requireUser, async (req, res, next) => {
  try {
    const { password } = req.body;
    const { userId } = req.params;
    const user = await getUserById(userId);
    if (!user) {
      throw Error("That user does not exist");
    }
    const userPassword = await getUser({ userId: user.id, password });
    if (!userPassword) {
      throw Error("Invalid password");
    }
    await deleteUser({ userId, password });
    res.send({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/:userId/follow', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id
    const follower = await createFollower({ userId, followerId });
    res.send({ message: "Follower successfully created", follower})
  } catch (error) {
    next(error)
  }
})

apiRouter.delete('/:userId/follow', requireUser, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id
    await deleteFollower({ userId, followerId });
    res.send({ message: "Follower successfully deleted"})
  } catch (error) {
    next(error)
  }
})

apiRouter.patch('/:userId', requireUser, async (req, res, next) => {
  try {
      const { id } = req.user
      const { userId } = req.params
      const user = await getUserById(userId)
      if (user.id === id || req.user.admin) {
      const updatedUser = await updateUser({id: userId, ...req.body})
      delete updatedUser.password
      updatedUser.followers = await getFollowersById(userId);
      updatedUser.following = await getFollowersByFollowerId(userId);
      updatedUser.squawks = await getSquawksByUserId(userId);
      updatedUser.messages = await getAllMessagesByUser(userId);
      const response = {
          updatedUser, message: "User successfully updated!"
      }
      res.send(response)} else {
          throw Error("User is not allowed to edit someone else's profile")
      }
  } catch (error) {
      next(error)
  }
})

module.exports = apiRouter;
