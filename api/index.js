const apiRouter = require('express').Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require('../db')
require("dotenv").config();
const { JWT_SECRET } = process.env;

apiRouter.get('/', (req, res, next) => {
  res.send({
    message: 'API is under construction!',
  });
});

apiRouter.get('/health', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const decodedData = jwt.verify(token, JWT_SECRET);

      if (decodedData) {
        req.user = await getUserById(decodedData.id);
        delete req.user.password;
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const squawksRouter = require("./squawks");
apiRouter.use("/squawks", squawksRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    error: error.error,
    message: error.message
  });
});

module.exports = apiRouter;
