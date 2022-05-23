// import all models
const Quote = require("./Quote");
const User = require("./User");
const Vote = require("./Vote");
const Comment = require("./Comment");

// create associations
User.hasMany(Quote, {
  foreignKey: "user_id",
});

Quote.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

User.belongsToMany(Quote, {
  through: Vote,
  as: "voted_quotes",

  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Quote.belongsToMany(User, {
  through: Vote,
  as: "voted_quotes",
  foreignKey: "quote_id",
  onDelete: "SET NULL",
});

Vote.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Vote.belongsTo(Quote, {
  foreignKey: "quote_id",
  onDelete: "SET NULL",
});

User.hasMany(Vote, {
  foreignKey: "user_id",
});

Quote.hasMany(Vote, {
  foreignKey: "quote_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Comment.belongsTo(Quote, {
  foreignKey: "quote_id",
  onDelete: "SET NULL",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Quote.hasMany(Comment, {
  foreignKey: "quote_id",
});

module.exports = { User, Quote, Vote, Comment };
