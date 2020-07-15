const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/logout", userController.logout);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
// router.get("/membership", userController.membershipGet);
// router.post("/membership", userController.membershipPost);
// router.get("/:id/delete", userController.userDeleteGet);
// router.post("/:id/delete", userController.userDeletePost);
// router.get("/:id/update", userController.userUpdateGet);
// router.post("/:id/update", userController.userUpdatePost);
router.get("/:id", userController.userDetail);
router.get("/", userController.userIndex);

module.exports = router;
