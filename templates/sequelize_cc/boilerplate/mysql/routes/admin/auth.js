const express = require('express');
const router = express.Router();
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const authController = require('../../controller/admin/authentication');
const auth = require('../../middleware/auth');
router.post('/register',(req,res,next)=>{
  req = adaptRequest(req);
  authController.register({ data:req.body }).then((result)=>{
    sendResponse(res,result);
  });
});

router.post('/login',(req,res,next)=>{
  req = adaptRequest(req);
  authController.authentication(req).then((result) => {
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});

router.post('/forgot-password', (req, res, next) => {
  req = adaptRequest(req);
  authController.forgotPassword(req.body).then((result) => {
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res, error);
    });
});

router.post('/validate-otp',(req,res,next)=>{
  req = adaptRequest(req);
  authController.validateResetPasswordOtp(req.body).then((result) => {
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res, error);
    });
});

router.put('/reset-password',(req,res,next)=>{
  req = adaptRequest(req);
  authController.resetPassword(req.body).then((result) => {
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res, error);
    });
});

router.post('/logout',auth(...[ 'logoutByUserInAdminPlatform', 'logoutByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  authController.logout(req).then((result) => {
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res, error);
    });
});

module.exports = router;
