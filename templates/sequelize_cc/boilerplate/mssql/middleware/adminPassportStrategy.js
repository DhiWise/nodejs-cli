
const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');

const adminPassportStrategy = ({ userDb }) => async (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
  options.secretOrKey = JWT.ADMIN_SECRET;
        
  passport.use('admin-rule',
    new Strategy(options, async (payload, done) => {            
      try {
        const user = await userDb.findOne({ id: payload.id });
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
module.exports = adminPassportStrategy;