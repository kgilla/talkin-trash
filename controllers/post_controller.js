const Post = require("../models/post");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.createGet = (req, res) => {
  if (req.user) {
    res.render("post_form", { heading: "Create Post" });
  } else {
    req.flash("error", "Please Log In");
    res.redirect("/users/login");
  }
};

exports.createPost = [
  body("title").not().isEmpty().withMessage("Title is required"),

  body("content").not().isEmpty().withMessage("An actual message is required"),

  body("*").trim().escape(),

  (req, res, next) => {
    const { title, content } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("post_form", {
        heading: "Create Post",
        errors: errors.array(),
        title,
        content,
      });
      return;
    }

    new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Post Created!");
      res.redirect("/");
    });
  },
];

exports.updateGet = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("author")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      if (post.author.id == req.user.id) {
        res.render("post_form", { post: post, heading: "Update Post" });
      } else {
        res.redirect("/");
      }
    });
};

exports.updatePost = [
  body("title").not().isEmpty().withMessage("Title is required"),

  body("content").not().isEmpty().withMessage("An actual message is required"),

  body("*").trim().escape(),

  (req, res, next) => {
    const { title, content } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("post_form", {
        heading: "Update Post",
        errors: errors.array(),
        title,
        content,
      });
      return;
    }

    Post.findByIdAndUpdate(
      req.params.id,
      {
        title: title,
        content: content,
        author: req.user,
        updated: Date.now(),
        _id: req.params.id,
      },
      {},
      (err, thePost) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Post updated successfully!");
        res.redirect("/");
      }
    );
  },
];
exports.deleteGet = (req, res, next) => {};
exports.deletePost = (req, res, next) => {};
exports.detail = (req, res, next) => {};
