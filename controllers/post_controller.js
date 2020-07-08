const Post = require("../models/post");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.createGet = (req, res) => {
  if (req.user) {
    res.render("post_form", { title: "Create Post" });
  } else {
    res.redirect("/users/login");
  }
};

exports.createPost = (req, res) => {};

// exports.createGet = (req, res) => {

// }
