const router = require("express").Router();

const apiRoutes = require("./api/");
const homeRoutes = require("./home-routes.js");
const dashboardRoutes = require("./dashboard-routes.js");
// const authRoutes =require("./auth.js");
router.use("/", homeRoutes);
// router.use("/", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/api", apiRoutes);

module.exports = router;
