const router = require("express").Router();
const sequelize = require("../config/connection");
const { Quote, User, Comment, Liked } = require("../models");
const withAuth = require("../utils/auth");

// get all Quotes for dashboard
router.get("/", withAuth, (req, res) => {
  console.log(req.session);
  console.log("======================");
  Quote.findAll({
    where: {
      user_id: req.session.user_id,
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
        model: Comment,
        attributes: ["id", "comment_text", "quote_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbQuoteData) => {
      const quotes = dbQuoteData.map((quote) => quote.get({ plain: true }));
      res.render("dashboard", { quotes, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Quote.findByPk(req.params.id, {
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
        model: Comment,
        attributes: ["id", "comment_text", "quote_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbQuoteData) => {
      if (dbQuoteData) {
        const quote = dbQuoteData.get({ plain: true });

        res.render("edit-quote", {
          quote,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
