const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Login functions

exports.loginGet = (req, res) => {
  res.render("log_in_form", { title: "Log In", message: req.flash("error") });
};

exports.loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true,
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

// Sign Up Functions

exports.signupGet = (req, res) => {
  res.render("sign_up_form", { title: "Sign Up" });
};

exports.signupPost = [
  // Make sure email is email
  body("email", "must be valid email address").isEmail(),
  // password must be at least 5 chars long
  body("password", "password must be at least 5 characters long").isLength({
    min: 5,
  }),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  (req, res, next) => {
    const { email, password, first_name, last_name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign_up_form", {
        errors: errors.array(),
        title: "Sign Up",
        email,
        first_name,
        last_name,
      });
      return;
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        firstName: first_name,
        lastName: last_name,
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];

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
