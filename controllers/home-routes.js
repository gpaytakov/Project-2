const router = require("express").Router();
const sequelize = require("../config/connection");
const { Quote, User, Comment, Vote } = require("../models");

// get all quotes for homepage
router.get("/", (req, res) => {
  console.log("======================");
  Quote.findAll({
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

      res.render("homepage", {
        quotes,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single quote
router.get("/quote/:id", (req, res) => {
  Quote.findOne({
    where: {
      id: req.params.id,
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
      if (!dbQuoteData) {
        res.status(404).json({ message: "No quote found with this id" });
        return;
      }

      const quote = dbQuoteData.get({ plain: true });

      res.render("single-quote", {
        quote,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

module.exports = router;
