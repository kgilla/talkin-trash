const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/create", userController.userCreateGet);
router.post("/user/create", userController.userCreatePost);
router.get("/user/:id/delete", userController.userDeleteGet);
router.post("/user/:id/delete", userController.userDeletePost);
router.get("/user/:id/update", userController.userUpdateGet);
router.post("/user/:id/update", userController.userUpdatePost);
router.get("/user/:id", userController.userDetail);
router.get("/users", userController.userIndex);

module.exports = router;
