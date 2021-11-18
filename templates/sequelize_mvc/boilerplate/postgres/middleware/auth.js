const passport = require('passport');
const {
  ROLE_RIGHTS, USER_ROLE 
} = require('../constants/authConstant');
const model = require('../model');
const dbService = require('../utils/dbService');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
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
  if (requiredRights.length) {
    for (role in USER_ROLE){
      if (USER_ROLE[role] === user.role){
        const userRights = ROLE_RIGHTS[user.role];
        const hasRequiredRights = requiredRights.some((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights || !user.id) {
          return reject('Unauthorized user');
        }
      }
    }
  }
  resolve();
};

/*
 * policy : authentication & authorization policy for platform wise check, 
 *          whether user is authenticated and authorized or not
 */
const auth = (...requiredRights) => async (req, res, next) => {

  let url = req.originalUrl;
  if (url.includes('device')){
    return new Promise((resolve, reject) => {
      passport.authenticate('device-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        return res.unAuthorizedRequest();
      });
  }
  else if (url.includes('admin')){
    return new Promise((resolve, reject) => {
      passport.authenticate('admin-rule', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        return res.unAuthorizedRequest();
      });
  }
};

module.exports = auth;
