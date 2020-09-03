const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");
const { isAuthenticated } = require("./middleware");

router.get("/create", isAuthenticated, postController.createGet);
router.post("/create", isAuthenticated, postController.createPost);
router.get("/:id/delete", isAuthenticated, postController.deleteGet);
router.post("/:id/delete", isAuthenticated, postController.deletePost);
router.get("/:id/update", isAuthenticated, postController.updateGet);
router.post("/:id/update", isAuthenticated, postController.updatePost);
router.get("/:id", isAuthenticated, postController.readGet);

module.exports = router;
