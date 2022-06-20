var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var db = require("../models");

const router = express.Router();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function verify(email, password, cb) {
        const verifyPassword = ((password, userPassword) => {
            return bcrypt.compareSync(password, userPassword);
        })
        db.User.findOne({
          where: {
            email: email,
          },
        }).then((dbUserData) => {
            if (!dbUserData) {
                return cb(null, false, {message: 'no email found'});
            };
            if (!verifyPassword(password, dbUserData.password)) {
                return ccb(null, false, { message: "incorrect password" });
            }
            const user_info = dbUserData.get();
            return cb(null, user_info);
        }).catch((err) => {
            return cb(null, false, {message: 'something went wrong with login!'})
        });
    }
  )
);

router.get("/login", function (req, res, next) {
  res.render("login");
});

module.exports = router;
