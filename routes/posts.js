const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");

router.get("/create", postController.createGet);
router.post("/create", postController.createPost);
// router.get("/:id/delete", postController.postDeleteGet);
// router.post("/:id/delete", postController.postDeletePost);
// router.get("/:id/update", postController.postUpdateGet);
// router.post("/:id/update", postController.postUpdatePost);
// router.get("/:id", postController.detail);
router.get("/", postController.index);

module.exports = router;
