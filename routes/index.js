const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/", async (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }
      res.render("home", { title: "welcome", posts: posts });
    });
});

module.exports = router;
