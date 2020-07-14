const Post = require("../models/post");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { render } = require("pug");

exports.createGet = (req, res) => {
  if (req.user) {
    res.render("post_form", { title: "Create Post" });
  } else {
    res.redirect("/users/login");
  }
};

exports.createPost = (req, res, next) => {
  new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/posts/");
  });
};

exports.index = async (req, res, next) => {
  await Post.find()
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        next(err);
      }
      res.render("post_index", { posts: posts });
    });
};
