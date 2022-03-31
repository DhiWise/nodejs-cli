/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const {
  LOGIN_ACCESS, USER_TYPES,PLATFORM
} = require('../constants/authConstant');
const responseHandler = require('../utils/response/responseHandler');
const { unAuthorized } = require('../utils/response');

const verifyCallback = (userTokenDb, req, resolve, reject, platform) => async (error, user, info) => {
  if (error || info || !user) {
    return reject('Unauthorized User');
  }
  req.user = user;
  if (!user.isActive) {
    return reject('User is deactivated');
  }
  let userToken = await userTokenDb.findOne({
    token:(req.headers.authorization).replace('Bearer ',''),
    userId:user.id
  });
  if (!userToken){
    return reject('Token not found');
  }
  if (userToken.isTokenExpired){
    return reject('Token is Expired');
  }
  if (user.userType) {
    let allowedPlatforms = LOGIN_ACCESS[user.userType] ? LOGIN_ACCESS[user.userType] : [];
    if (!allowedPlatforms.includes(platform)) {
      return reject('Unauthorized user');
    }
  }
  resolve();
};

const auth = ({
  passport, userTokenDb
}) => (platform) => async (req, res, next) => {
    
  if (platform == PLATFORM.DEVICE){
    return new Promise((resolve, reject) => {
      passport.authenticate('device-rule', { session: false }, verifyCallback(userTokenDb,req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        responseHandler(res,unAuthorized());
      });
  }
    
  else if (platform == PLATFORM.ADMIN){
    return new Promise((resolve, reject) => {
      passport.authenticate('admin-rule', { session: false }, verifyCallback(userTokenDb,req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((error) => {
        responseHandler(res,unAuthorized());
      });
  }
   
};

module.exports = auth;
