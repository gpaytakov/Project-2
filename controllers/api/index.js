const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const quoteRoutes = require("./quote-routes");
const commentRoutes = require("./comment-routes");

router.use("/users", userRoutes);
router.use("/quotes", quoteRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
