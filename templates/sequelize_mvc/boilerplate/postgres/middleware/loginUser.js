/**
 * loginUser.js
 * @description :: middleware that verifies user's JWT token
 */

const jwt = require('jsonwebtoken');
const { PLATFORM } = require('../constants/authConstant');
const deviceSecret = require('../constants/authConstant').JWT.DEVICE_SECRET;
const adminSecret = require('../constants/authConstant').JWT.ADMIN_SECRET;

/**
 * @description : middleware for authenticate user with JWT token
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const authenticateJWT = (platform) =>  (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.unAuthorized();
  }
  const token = authHeader.split(' ')[1];
  let secret = '';
  if (platform == PLATFORM.DEVICE){
    secret = deviceSecret;
  }
  else  if (platform == PLATFORM.ADMIN){
    secret = adminSecret;
  }
  jwt.verify(token,secret, (error, user) => {
    if (error) {
      return res.unAuthorized();
    }
    req.user = user;
    next();
  });

};
module.exports = authenticateJWT;