const express = require("express");
const User = require("../models/userModel");
const authController = require("../controllers/auth/index");
const roles = require("../constants/userRoles");
const passwordController=require("../controllers/auth/passwordController")
const userController = require("../controllers/user/userController");
const { authenticate, restrictTo } = require("../middlewares/auth");

const router = express.Router();
router
    .route('/login')
	.post(userController.login);
router
	.route('/signUp')
	.post(userController.signup);

router
    .route('/forgotPassword')
		.post(passwordController.forgotPassword);
router
	.route('/resetPassword')
	.post(passwordController.resetPassword);
 
	
module.exports = router;