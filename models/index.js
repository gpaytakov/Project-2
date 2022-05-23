// import all models
const Quote = require("./Quote");
const User = require("./User");
const Liked = require("./Liked");
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
  through: Liked,
  as: "liked_quotes",

  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Quote.belongsToMany(User, {
  through: Liked,
  as: "liked_quotes",
  foreignKey: "quote_id",
  onDelete: "SET NULL",
});

Liked.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

Liked.belongsTo(Quote, {
  foreignKey: "quote_id",
  onDelete: "SET NULL",
});

User.hasMany(Liked, {
  foreignKey: "user_id",
});

Quote.hasMany(Liked, {
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

module.exports = { User, Quote, Liked, Comment };
