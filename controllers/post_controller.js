const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.createGet = (req, res) => {
  res.render("post_form", { heading: "Create Post" });
};

exports.createPost = [
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),

  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("An actual message is required"),

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
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),

  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("An actual message is required"),

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

exports.deleteGet = (req, res, next) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) {
      return next(err);
    }
    res.render("post_delete_form", { post });
  });
};

exports.deletePost = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id, {}, (err, success) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Post deleted successfully!");
    res.redirect("/");
  });
};

exports.readGet = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("author")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      res.render("post", { title: "Post", post });
    });
};
