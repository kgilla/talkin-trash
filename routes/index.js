const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/", (req, res, next) => {
  Post.find()
    .sort({ date: -1 })
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      const smallPosts = posts.slice(0, 5);
      res.render("home", {
        title: "Talkin' Trash",
        posts: posts,
        smallPosts: smallPosts,
        success: req.flash("success"),
      });
    });
});

module.exports = router;
