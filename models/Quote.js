const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
// create our Quote model
class Quote extends Model {
  static upliked(body, models) {
    return models.Liked.create({
      user_id: body.user_id,
      quote_id: body.quote_id,
    }).then(() => {
      return Quote.findOne({
        where: {
          id: body.quote_id,
        },
        attributes: [
          "id",
          "author",
          "text",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM liked WHERE quote.id = liked.quote_id)"
            ),
            "liked_count",
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
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
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
