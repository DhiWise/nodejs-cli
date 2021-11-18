const jwt = require('jsonwebtoken');
const deviceSecret = require('../constants/authConstant').JWT.DEVICE_SECRET;
const adminSecret = require('../constants/authConstant').JWT.ADMIN_SECRET;
/*
 * policy : authentication policy to check, 
 *          whether user is authenticated or not
 */
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
        return res.unAuthorizedRequest();
      }
      req.user = user;
      next();
    });
  } else {
    return res.unAuthorizedRequest();
  }
};
module.exports = authenticateJWT;