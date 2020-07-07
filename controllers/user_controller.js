const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.loginGet = (req, res) => {
  res.render("log_in_form", { title: "Log In" });
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
});

exports.signupGet = (req, res) => {
  res.render("sign_up_form", { title: "Sign Up" });
};

exports.signupPost = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    new User({
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};
