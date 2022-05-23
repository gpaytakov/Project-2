const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Quote, User, Comment, Vote } = require("../../models");
const withAuth = require("../../utils/auth");

// get all users
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
      res.json(dbQuoteData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', quote_url: 'https://taskmaster.com/press', user_id: 1}
  Quote.create({
    title: req.body.title,
    quote_url: req.body.quote_url,
    user_id: req.session.user_id,
  })
    .then((dbQuoteData) => res.json(dbQuoteData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/upvote", withAuth, (req, res) => {
  // custom static method created in models/Quote.js
  Quote.upvote(
    { ...req.body, user_id: req.session.user_id },
    { Vote, Comment, User }
  )
    .then((updatedVoteData) => res.json(updatedVoteData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  Quote.update(
    {
      title: req.body.title,
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
