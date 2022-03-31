/**
 * @description : exports authentication strategy for admin using passport.js
 * @params {obj} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */

const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const model = require('../model/index');
const dbService = require('../utils/dbService');

const adminPassportStrategy = async (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = JWT.ADMIN_SECRET;
  passport.use('admin-rule',
    new Strategy(options, async (payload, done) => {
      try {
        const user = await dbService.findOne(model.user,{ id: payload.id });
        if (user) {
          return done(null, { ...user.toJSON() });
        }
        return done('No User Found', {});
      } catch (error) {
        return done(error,{});
      }            
    }) 
  );        
};
module.exports = { adminPassportStrategy };