/**
 * loginUser.js
 * @description :: middleware that verifies user's JWT token
 */

const jwt = require('jsonwebtoken');
const message = require('../utils/messages');
const sendResponse = require('../helpers/sendResponse');
const deviceSecret = require('../config/constant').JWT.DEVICE_SECRET;
const adminSecret = require('../config/constant').JWT.ADMIN_SECRET;
const authenticateJWT = (platform) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    let secret = '';
    if (platform == PLATFORM.DEVICE){
      secret = deviceSecret;
    }
    else if (platform == PLATFORM.ADMIN){
      secret = adminSecret;
    }
    jwt.verify(token,secret, (error, user) => {
      if (error) {
        sendResponse(res,  message.unAuthorizedRequest());
      }
      req.user = user;
      next();
    });
  } else {
    sendResponse(res,  message.unAuthorizedRequest());
  }
};
module.exports = authenticateJWT;