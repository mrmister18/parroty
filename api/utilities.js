async function requireUser(req, res, next) {
    try {
      if (!req.user)
        next({
          name: "MissingUserError",
          message: "You must be logged in to perform this action",
        });
      next();
    } catch (error) {
      console.error();
      next(error);
    }
  }

  module.exports = {
    requireUser
  }