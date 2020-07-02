const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.home);

router.get("/post/create", postController.postCreateGet);
router.post("/post/create", postController.postCreatePost);
router.get("/post/:id/delete", postController.postDeleteGet);
router.post("/post/:id/delete", postController.postDeletePost);
router.get("/post/:id/update", postController.postUpdateGet);
router.post("/post/:id/update", postController.postUpdatePost);
router.get("/post/:id", postController.postDetail);
router.get("/posts", postController.postIndex);

module.exports = router;
