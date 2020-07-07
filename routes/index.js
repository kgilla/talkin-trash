const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home", { title: "welcome", user: req.user });
});

module.exports = router;
