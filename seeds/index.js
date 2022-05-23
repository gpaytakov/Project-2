const seedUsers = require("./user-seeds");
const seedQuotes = require("./quote-seeds");
const seedComments = require("./comment-seeds");
const seedLikeds = require("./liked-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log("--------------");
  await seedUsers();
  console.log("--------------");

  await seedQuotes();
  console.log("--------------");

  await seedComments();
  console.log("--------------");

  await seedLikeds();
  console.log("--------------");

  process.exit(0);
};

seedAll();
