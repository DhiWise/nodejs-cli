const jwt = require('jsonwebtoken');
const message = require('../utils/messages');
const sendResponse = require('../helpers/sendResponse');
const deviceSecret = require('../config/constant').JWT.DEVICE_SECRET;
const adminSecret = require('../config/constant').JWT.ADMIN_SECRET;
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    let url = req.originalUrl;
    let secret = '';
    if (url.includes('device')){
      secret = deviceSecret;
    }
    else if (url.includes('admin')){
      secret = adminSecret;
    }
    jwt.verify(token,secret, (err, user) => {
      if (err) {
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