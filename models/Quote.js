const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
// create our Quote model
class Quote extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      quote_id: body.quote_id,
    }).then(() => {
      return Quote.findOne({
        where: {
          id: body.quote_id,
        },
        attributes: [
          "id",
          "quote_url",
          "title",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM vote WHERE quote.id = vote.quote_id)"
            ),
            "vote_count",
          ],
        ],
        include: [
          {
            model: models.Comment,
            attributes: [
              "id",
              "comment_text",
              "quote_id",
              "user_id",
              "created_at",
            ],
            include: {
              model: models.User,
              attributes: ["username"],
            },
          },
        ],
      });
    });
  }
}

// create fields/columns for Quote model
Quote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quote_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "quote",
  }
);

module.exports = Quote;
