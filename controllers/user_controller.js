const User = require("../models/user");
const Post = require("../models/post");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// Login functions

exports.loginGet = (req, res) => {
  res.render("log_in_form", {
    title: "Log In",
    error: req.flash("error"),
    success: req.flash("success"),
  });
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

// Membership functions

exports.membershipGet = (req, res) => {
  if (req.user) {
    res.render("membership_form", { title: "Membership" });
  } else {
    req.flash("error", "You must be logged in to access that");
    res.redirect("/users/login");
  }
};

exports.membershipPost = [
  // Checks if field is empty
  body("code").not().isEmpty().withMessage("You must enter a code"),
  // Checks if field is correct password
  body("code").equals("Kenneth").withMessage("Sorry the code is incorrect"),
  // Cleans up field
  body("*").escape().trim(),

  (req, res, next) => {
    const code = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("membership_form", {
        errors: errors.array(),
        code: code,
      });
      return;
    }

    User.findByIdAndUpdate(req.params.id, { isMember: true }, {}, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Your membership has been updated!");
      res.redirect("/");
    });
  },
];

// Sign Up Functions

exports.signupGet = (req, res) => {
  res.render("sign_up_form", { title: "Sign Up" });
};

exports.signupPost = [
  // Checks names are entered
  body("first_name").not().isEmpty().withMessage("First name is required"),
  body("last_name").not().isEmpty().withMessage("Last name is required"),

  // checks email
  body("email").not().isEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Must be valid email address"),
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject("Email is already in use");
      }
      Promise.resolve(true);
    });
  }),

  // checks password
  body("password").not().isEmpty().withMessage("Password is required"),

  // password must be at least 5 chars long
  body("password")
    .isLength({
      min: 5,
    })
    .withMessage("password must be at least 5 characters long"),

  // checks passwords match
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  body("*").trim().escape(),

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
        req.flash("success", "Account created successfully, you may log in");
        res.redirect("/users/login");
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
    Post.find({ author: req.user.id })
      .populate("author")
      .exec((err, posts) => {
        if (err) {
          return next(err);
        }
        res.render("profile", { posts });
      });
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
