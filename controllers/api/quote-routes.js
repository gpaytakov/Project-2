const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Quote, User, Comment, Liked } = require("../../models");
const withAuth = require("../../utils/auth");

// get all users
router.get("/", (req, res) => {
  console.log("======================");
  Quote.findAll({
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
    .then((dbQuoteData) => res.json(dbQuoteData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Quote.findOne({
    where: {
      id: req.params.id,
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
      if (!dbQuoteData) {
        res.status(404).json({ message: "No quote found with this id" });
        return;
      }
      res.json(dbQuoteData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  // expects {text: 'Taskmaster goes public!', author: 'https://taskmaster.com/press', user_id: 1}
  Quote.create({
    text: req.body.text,
    author: req.body.author,
    user_id: req.session.user_id,
  })
    .then((dbQuoteData) => res.json(dbQuoteData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/upliked", withAuth, (req, res) => {
  // custom static method created in models/Quote.js
  Quote.upliked(
    { ...req.body, user_id: req.session.user_id },
    { Liked, Comment, User }
  )
    .then((updatedLikedData) => res.json(updatedLikedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  Quote.update(
    {
      text: req.body.text,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbQuoteData) => {
      if (!dbQuoteData) {
        res.status(404).json({ message: "No quote found with this id" });
        return;
      }
      res.json(dbQuoteData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  console.log("id", req.params.id);
  Quote.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbQuoteData) => {
      if (!dbQuoteData) {
        res.status(404).json({ message: "No quote found with this id" });
        return;
      }
      res.json(dbQuoteData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
