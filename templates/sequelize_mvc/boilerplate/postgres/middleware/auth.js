/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const passport = require('passport');
const {
  LOGIN_ACCESS, USER_TYPES,PLATFORM 
} = require('../constants/authConstant');
const model = require('../model');
const dbService = require('../utils/dbService');

/**
 * @description : returns callback that verifies required access
 * @param {obj} req : request of route.
 * @param {callback} resolve : resolve callback for succeeding method.
 * @param {callback} reject : reject callback for error.
 * @param {int} platform : platform.
 */
const verifyCallback = (req, resolve, reject, platform) => async (err, user, info) => {
  if (err || info || !user) {
    return reject('Unauthorized User');
  }
  req.user = user;
  if (!user.isActive) {
    return reject('User is deactivated');
  }
  let userToken = await dbService.findOne(model.userToken,{
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

/**
 * @description : authentication middleware for request.
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 * @param {int} platform : platform.
 */
const auth = (platform) => async (req, res, next) => {

  if (platform == PLATFORM.DEVICE){
    return new Promise((resolve, reject) => {
      passport.authenticate('device-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        return res.unAuthorized();
      });
  }
  else if (platform == PLATFORM.ADMIN){
    return new Promise((resolve, reject) => {
      passport.authenticate('admin-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        return res.unAuthorized();
      });
  }
};

module.exports = auth;
