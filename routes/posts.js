const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");

router.get("/create", postController.createGet);
router.post("/create", postController.createPost);
router.get("/:id/delete", postController.deleteGet);
router.post("/:id/delete", postController.deletePost);
router.get("/:id/update", postController.updateGet);
router.post("/:id/update", postController.updatePost);

module.exports = router;
