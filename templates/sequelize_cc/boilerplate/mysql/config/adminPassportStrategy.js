
/*
 * admin authentication - with passport
 */

const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const userModel  = require('../model').user;
const userService = require('../services/dbService')({ model:userModel });
module.exports = {
  adminPassportStrategy: passport => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = JWT.ADMIN_SECRET;
    passport.use('admin-rule',
      new Strategy(options, (payload, done) => {
        userService.findOne({ id: payload.id }).then((user)=>{
          if (user) {
            return done(null, { ...user.toJSON() });
          }
          return done('No User Found', {});
        }).catch(err => done(err, false));
      })
    );
  }
};