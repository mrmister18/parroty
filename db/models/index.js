module.exports = {
  // add each model to your exports object here
  // so that you can use them in your express server api routers
  // for example, create a users.js file for a User model
  // and User: require('./user') here
  ...require('./user'),
  ...require('./squawks'),
  ...require('./comments'),
  ...require('./messages'),
  ...require('./followers'),
  ...require('./parrots'),
  ...require('./likes'),
  User: require('./user'),
  Squawks: require('./squawks'),
  Comments: require('./comments'),
  Messages: require('./messages'),
  Followers: require('./followers'),
  Parrots: require('./parrots'),
  Likes: require('./likes')
};

// then, in your API, you'll require the appropriate model
// and use its database connectors
// ie User.getUserById(), where user.js had a module.exports
// that looked like this: module.exports = { getUserById, ... }
