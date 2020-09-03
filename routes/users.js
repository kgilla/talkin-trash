const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const { isAuthenticated } = require("./middleware");

router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/logout", userController.logout);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
router.get("/:id/membership", isAuthenticated, userController.membershipGet);
router.post("/:id/membership", isAuthenticated, userController.membershipPost);
router.get("/:id/delete", isAuthenticated, userController.userDeleteGet);
router.post("/:id/delete", isAuthenticated, userController.userDeletePost);
router.get("/:id/update", isAuthenticated, userController.updateGet);
router.post("/:id/update", isAuthenticated, userController.updatePost);
router.get("/:id/password", isAuthenticated, userController.passwordGet);
router.post("/:id/password", isAuthenticated, userController.passwordPost);
router.get("/:id", isAuthenticated, userController.userDetail);

module.exports = router;
