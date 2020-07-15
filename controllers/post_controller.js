const Post = require("../models/post");
const User = require("../models/user");

exports.createGet = (req, res) => {
  if (req.user) {
    res.render("post_form", { title: "Create Post" });
  } else {
    req.flash("error", "Please Log In");
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
    req.flash("success", "Post Created!");
    res.redirect("/");
  });
};
