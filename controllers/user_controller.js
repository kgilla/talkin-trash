const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// Login functions

exports.loginGet = (req, res) => {
  res.render("log_in_form", { title: "Log In" });
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

// Sign Up Functions

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

exports.userUpdateGet = (req, res) => {};

exports.userUpdatePost = (req, res) => {};

exports.userDeleteGet = (req, res) => {};
exports.userDeleteGet = (req, res) => {};

exports.userDetail = (req, res) => {
  if (req.user) {
    res.render("profile");
  } else {
    res.redirect("/users/login");
  }
};

exports.userIndex = async (req, res) => {
  if (req.user) {
    await User.find().exec((err, users) => {
      if (err) {
        return next(err);
      }
      res.render("user_index", { title: "All Users", users: users });
    });
  } else {
    res.redirect("/users/login");
  }
};
