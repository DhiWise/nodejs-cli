let  userDb = require('../../../data-access/userDb');
const userTokensDb = require('../../../data-access/userTokensDb');

const userSchema = require('../../../validation/schema/user');
const createValidation = require('../../../validation')(userSchema.createSchema);

const userRoleDb  = require('../../../data-access/userRoleDb');
const routeRoleDb = require('../../../data-access/routeRoleDb');

const authController = require('./authController');

const registerUsecase = require('../../../use-case/authentication/register')({ 
  userDb, 
  createValidation, 
});
const forgotPasswordUsecase = require('../../../use-case/authentication/forgotPassword')({ userDb });
const resetPasswordUsecase = require('../../../use-case/authentication/resetPassword')({ userDb });
const validateResetPasswordOtpUsecase = require('../../../use-case/authentication/validateResetPasswordOtp')({ userDb });
const logoutUsecase = require('../../../use-case/authentication/logout')({ userTokensDb });
const authenticationUsecase = require('../../../use-case/authentication/authentication')({
  userDb,
  userTokensDb,
  userRoleDb,
  routeRoleDb
});

const register = authController.register(registerUsecase);
const forgotPassword = authController.forgotPassword(forgotPasswordUsecase);
const resetPassword = authController.resetPassword(resetPasswordUsecase);
const validateResetPasswordOtp = authController.validateResetPasswordOtp(validateResetPasswordOtpUsecase);
const logout = authController.logout(logoutUsecase);
const authentication = authController.authentication(authenticationUsecase);

module.exports = {
  register,
  forgotPassword,
  resetPassword,
  validateResetPasswordOtp,
  logout,
  authentication,
};