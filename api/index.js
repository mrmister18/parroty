const apiRouter = require('express').Router();

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
