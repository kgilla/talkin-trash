const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/", async (req, res, next) => {
  Post.find()
    .sort({ date: -1 })
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      const smallPosts = posts.slice(0, 5);
      res.render("home", {
        title: "welcome",
        posts: posts,
        smallPosts: smallPosts,
        success: req.flash("success"),
      });
    });
});

module.exports = router;
