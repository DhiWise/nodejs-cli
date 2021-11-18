/*
 * device authentication - with passport
 */

const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const model = require('../model/index');
const dbService = require('../utils/dbService');

module.exports = {
  devicePassportStrategy: passport => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = JWT.DEVICE_SECRET;
    passport.use('device-rule',
      new Strategy(options, (payload, done) => {
        dbService.findOne(model.user,{ id: payload.id }).then((user)=>{
          if (user) {
            return done(null, { ...user.toJSON() });
          }
          return done('No User Found', {});
        }).catch(err => done(err, false));
      })
    );
  }
};