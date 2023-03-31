const {
  client,
  User,
  Squawks,
  Messages,
  Comments,
  Followers,
  Parrots,
  Likes
  // declare your model imports here
  // for example, User
} = require("./");

async function buildTables() {
  try {
    client.connect();
    console.log("Beginning to drop tables...");

    await client.query(
      `DROP TABLE IF EXISTS parrots;
      DROP TABLE IF EXISTS likes;
      DROP TABLE IF EXISTS followers;
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS squawks;
      DROP TABLE IF EXISTS users;`
    );

    console.log("Finished dropping tables!");

    // drop tables in correct order
    console.log("Beginning to create tables...");

    await client.query(
      `CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      bio TEXT,
      "profilePicture" TEXT,
      admin BOOLEAN DEFAULT FALSE
    );
    
    CREATE TABLE squawks (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "squawkContent" TEXT,
      picture TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "postedAt" VARCHAR(255) DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'Month, DD YYYY HH12:MI'),
      edited BOOLEAN DEFAULT FALSE
    );
    
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      "squawkId" INTEGER REFERENCES squawks(id),
      "userId" INTEGER REFERENCES users(id),
      "commentContent" TEXT NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "postedAt" VARCHAR(255) DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'Month, DD YYYY HH12:MI')
    );
    
    CREATE TABLE messages (
      id SERIAL PRIMARY KEY,
      sender INTEGER REFERENCES users(id),
      receiver INTEGER REFERENCES users(id),
      "messageContent" TEXT NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "postedAt" VARCHAR(255) DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'Month, DD YYYY HH12:MI')
    );
    
    CREATE TABLE followers (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "followerId" INTEGER REFERENCES users(id),
      UNIQUE ("userId", "followerId")
    );
    
    CREATE TABLE parrots (
      id SERIAL PRIMARY KEY,
      "squawkId" INTEGER REFERENCES squawks(id),
      "userId" INTEGER REFERENCES users(id),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "postedAt" VARCHAR(255) DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'Month, DD YYYY HH12:MI'),
      UNIQUE ("userId", "squawkId")
    );
    
    CREATE TABLE likes (
      id SERIAL PRIMARY KEY,
      "squawkId" INTEGER REFERENCES squawks(id),
      "userId" INTEGER REFERENCES users(id),
      UNIQUE ("squawkId", "userId")
    );`
    );
    console.log("Finished creating tables!");
    // build tables in correct order
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
    console.log("Starting to create users...");
    const usersToCreate = [
      {
        username: "loverboi19",
        password: "studmuffin123",
        name: "Boyle McPoyle",
        bio: "I'm just a handsome guy lookin' for love in all the wrong places"},
      { username: "sonofcrush1", password: "gnarly81", name: "Squirt", bio: "Chillin' and vibin'", profilePicture: "https://qph.cf2.quoracdn.net/main-qimg-3856e8aa0affaa7501e99dd0750deef0-lq" },
      {
        username: "hexmama24",
        password: "toilandtrouble666",
        name: "Helga the Horrible",
        bio: "I like to travel and eat the occasional child",
        profilePicture: "https://static.theprint.in/wp-content/uploads/2020/10/witch-portrait-fantasy-fairy-tale-e1604119216420.jpg"
      },
    ];
    const users = await Promise.all(usersToCreate.map(User.createUser));
    console.log("Created users: ", users, "Finished creating users!");

    console.log("Starting to create squawks...");
    const squawksToCreate = [
      { userId: 1, squawkContent: "This is my first squawk!" },
      { userId: 2, squawkContent: "Content" },
      { userId: 3, squawkContent: "I am watching The Thing" },
    ];
    const squawks = await Promise.all(
      squawksToCreate.map(Squawks.createSquawk)
    );
    console.log("Created squawks: ", squawks, "Finished creating squawks!");

    console.log("Starting to create messages...");
    const messagesToCreate = [
      { sender: 1, receiver: 2, messageContent: "That guy is a jerk, pass it on" },
      { sender: 2, receiver: 3, messageContent: "That guy has jerky, pass it on" },
      { sender: 3, receiver: 1, messageContent: "This guy is a jive turkey, pass it on" }
    ];
    const messages = await Promise.all(
      messagesToCreate.map(Messages.createMessage)
    );
    console.log("Created messages: ", messages, "Finished creating messages!");

    console.log("Starting to create comments...");
    const commentsToCreate = [
      { squawkId: 1, userId: 2, commentContent: "Well this is my first comment" },
      { squawkId: 2, userId: 3, commentContent: "I don't like this comment" },
      { squawkId: 3, userId: 1, commentContent: "I like this comment" }
    ];
    const comments = await Promise.all(
      commentsToCreate.map(Comments.createComment)
    );
    console.log("Created comments: ", comments, "Finished creating comments!");

    console.log("Starting to create followers...");
    const followersToCreate = [
      { userId: 1, followerId: 2 },
      { userId: 1, followerId: 3 },
      { userId: 2, followerId: 1 },
      { userId: 2, followerId: 3 },
      { userId: 3, followerId: 2 },
      { userId: 3, followerId: 1 }
    ];
    const followers = await Promise.all(
      followersToCreate.map(Followers.createFollower)
    );
    console.log("Created followers: ", followers, "Finished creating followers!");

    console.log("Starting to create parrots...");
    const parrotsToCreate = [
      { userId: 1, squawkId: 2 },
      { userId: 2, squawkId: 3 },
      { userId: 3, squawkId: 1 },
    ];
    const parrots = await Promise.all(
      parrotsToCreate.map(Parrots.createParrot)
    );
    console.log("Created parrots: ", parrots, "Finished creating parrots!");

    console.log("Starting to create likes...");
    const likesToCreate = [
      { userId: 1, squawkId: 2 },
      { userId: 2, squawkId: 3 },
      { userId: 3, squawkId: 1 },
    ];
    const likes = await Promise.all(
      likesToCreate.map(Likes.createLike)
    );
    console.log("Created likes: ", likes, "Finished creating likes!");
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
