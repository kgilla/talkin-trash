const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
// router.get("/user/:id/delete", userController.userDeleteGet);
// router.post("/user/:id/delete", userController.userDeletePost);
// router.get("/user/:id/update", userController.userUpdateGet);
// router.post("/user/:id/update", userController.userUpdatePost);
// router.get("/user/:id", userController.userDetail);
// router.get("/users", userController.userIndex);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);

module.exports = router;
