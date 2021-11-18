const express =  require('express');
const routes  =  express.Router();
const auth = require('../../middleware/auth');
const authController =  require('../../controller/device/authController');
routes.route('/register').post(authController.register);
routes.post('/login',authController.login);
routes.route('/forgot-password').post(authController.forgotPassword);
routes.route('/validate-otp').post(authController.validateResetPasswordOtp);
routes.route('/reset-password').put(authController.resetPassword);
routes.route('/logout').post(auth(...[ 'logoutByUserInDevicePlatform', 'logoutByAdminInDevicePlatform' ]), authController.logout);

module.exports = routes;