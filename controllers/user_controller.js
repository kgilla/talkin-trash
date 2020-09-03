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
  successFlash: true,
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

// Membership functions
exports.membershipGet = (req, res) => {
  res.render("membership_form", { title: "Membership" });
};

exports.membershipPost = [
  // Checks if field is empty
  body("code").not().isEmpty().withMessage("You must enter a code").trim(),
  // Checks if field is correct password
  body("code")
    .isIn([process.env.SECRET_PASSWORD, process.env.SUPER_SECRET])
    .withMessage("Sorry the code is incorrect")
    .trim(),

  (req, res, next) => {
    const code = req.body.code;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("membership_form", {
        errors: errors.array(),
        code: code,
        title: "Membership",
      });
      return;
    }

    if (code === process.env.SECRET_PASSWORD) {
      User.findByIdAndUpdate(req.params.id, { isMember: true }, {}, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Your membership has been updated!");
        res.redirect("/");
      });
    } else if (code === process.env.SUPER_SECRET) {
      User.findByIdAndUpdate(req.params.id, { isAdmin: true }, {}, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "You are now an admin!");
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  },
];

// Sign Up Functions
exports.signupGet = (req, res) => {
  res.render("sign_up_form", { title: "Sign Up" });
};

exports.signupPost = [
  // Checks names are entered
  body("first_name")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .trim(),

  body("last_name").not().isEmpty().withMessage("Last name is required").trim(),

  // checks email
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be valid email address")
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email is already in use");
        }
        Promise.resolve(true);
      });
    })
    .trim()
    .normalizeEmail(),

  // checks password
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 6,
    })
    .withMessage("password must be at least 6 characters long")
    .trim(),

  // checks passwords match
  body("password2")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    })
    .trim(),

  body("*").escape(),

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

// Update Functions
exports.updateGet = (req, res, next) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.render("info_change_form", { user });
  });
};

exports.updatePost = [
  // Checks names are entered
  body("first_name")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .trim(),

  body("last_name").not().isEmpty().withMessage("Last name is required").trim(),

  // checks email
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be valid email address")
    .trim(),

  // checks password
  body("password").not().isEmpty().withMessage("Password is required").trim(),

  (req, res, next) => {
    const { email, first_name, last_name, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("info_change_form", {
        errors: errors.array(),
        email,
        first_name,
        last_name,
      });
      return;
    }

    User.findById(req.params.id).exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (user.email !== email) {
        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return next(err);
          }
          if (user) {
            res.render("info_change_form", {
              error: "Email in use",
              email,
              first_name,
              last_name,
            });
          }
        });
      }
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          return next(err);
        }
        if (response == false) {
          res.render("info_change_form", {
            error: "Password incorrect",
            email,
            first_name,
            last_name,
          });
        } else if (response == true) {
          User.findByIdAndUpdate(
            req.params.id,
            {
              email: email,
              firstName: first_name,
              lastName: last_name,
            },
            {},
            (err) => {
              if (err) {
                return next(err);
              }
              req.flash(
                "success",
                "Your account has been updated successfully"
              );
              res.redirect(req.user.url);
            }
          );
        }
      });
    });
  },
];

exports.passwordGet = (req, res) => {
  res.render("password_change_form");
};

exports.passwordPost = [
  // checks old password
  body("old_password")
    .not()
    .isEmpty()
    .withMessage("Please enter old password")
    .trim(),

  // checks new password
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // checks passwords match
  body("password2")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    })
    .trim(),

  (req, res, next) => {
    const { old_password, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("password_change_form", {
        errors: errors.array(),
      });
      return;
    }

    User.findById(req.params.id).exec((err, user) => {
      if (err) {
        return next(err);
      }
      bcrypt.compare(old_password, user.password, (err, response) => {
        if (err) {
          return next(err);
        }
        if (response == false) {
          res.render("password_change_form", {
            error: "Password incorrect",
          });
        } else if (response == true) {
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            User.findByIdAndUpdate(
              req.params.id,
              {
                password: hashedPassword,
              },
              {},
              (err) => {
                if (err) {
                  return next(err);
                }
                req.flash(
                  "success",
                  "Your account has been updated successfully"
                );
                res.redirect(req.user.url);
              }
            );
          });
        }
      });
    });
  },
];

// Delete Functions
exports.userDeleteGet = (req, res) => {
  res.render("user_delete", { title: "Confirm Deletion" });
};

exports.userDeletePost = (req, res) => {};

// User Profile
exports.userDetail = async (req, res) => {
  await Post.find({ author: req.user.id })
    .sort({ date: -1 })
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      const count = posts.length;
      res.render("profile", { posts, count, success: req.flash("success") });
    });
};
