const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware');
const authController = require('../../../controller/device/v1/authentication');
const { PLATFORM } =  require('../../../constants/authConstant');

router.route('/register').post(authController.register);
router.route('/login').post(authController.authentication);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/validate-otp').post(authController.validateResetPasswordOtp);
router.route('/reset-password').put(authController.resetPassword);
router.route('/logout').post(auth(PLATFORM.DEVICE),authController.logout);

module.exports = router;
