const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME
} = require('../../constants/authConstant');
const dayjs = require('dayjs');
const generateToken = require('../../utils/generateToken');
const { getDifferenceOfTwoDatesInTime } = require('../../helpers/date');
const response = require('../../utils/response');
const responseStatus = require('../../utils/response/responseStatus');

const makeGetRoleAccess = require('../common/getRoleAccess');

const loginUser = ({
  userDb,userTokensDb,userRoleDb,routeRoleDb
})=> async (username,platform,password = null,roleAccess) => {

  let where = { 'username':username };
  let user = await userDb.findOne(where);
  if (user) {
    if (user.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT){
      let now = dayjs();
      if (user.loginReactiveTime){
        let limitTime = dayjs(user.loginReactiveTime);
        if (limitTime > now){
          let expireTime = dayjs().add(LOGIN_REACTIVE_TIME,'minute');
          if (!(limitTime > expireTime)){
            return response.badRequest({ message :`you have exceed the number of limit.you can login after ${getDifferenceOfTwoDatesInTime(now,limitTime)}.` });
          }   
          await userDb.updateOne({ _id :user.id },{
            loginReactiveTime:expireTime.toISOString(),
            loginRetryLimit:user.loginRetryLimit + 1  
          });
          return response.badRequest({ message : `you have exceed the number of limit.you can login after ${getDifferenceOfTwoDatesInTime(now,expireTime)}.` });
        } else {
          user = await userDb.updateOne({ _id:user.id },{
            loginReactiveTime:'',
            loginRetryLimit:0
          },{ new:true });
        }
      } else {
        // send error
        let expireTime = dayjs().add(LOGIN_REACTIVE_TIME,'minute');
        await userDb.updateOne(user.id,{
          loginReactiveTime:expireTime.toISOString(),
          loginRetryLimit:user.loginRetryLimit + 1 
        });
        return response.badRequest({ message :`you have exceed the number of limit.you can login after ${getDifferenceOfTwoDatesInTime(now,expireTime)}.` }); 
      } 
    }

    if (password){
      const isPasswordMatched = await user.isPasswordMatch(password);

      if (!isPasswordMatched){
        await userDb.updateOne({ _id : user.id },{ loginRetryLimit:user.loginRetryLimit + 1 });
        return response.badRequest({ message : 'incorrect password' });
      }

    }
    const userData = user.toJSON();
    let token;
    if (!user.userType) {
      return response.badRequest({ message : 'You have not been assigned role.' });
    }
    if (platform == PLATFORM.DEVICE){
      if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.DEVICE)){
        return response.badRequest({ message : 'you are unable to access this platform' });
      }
      token = await generateToken(userData,JWT.DEVICE_SECRET);
    }
    else if (platform == PLATFORM.ADMIN){
      if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.ADMIN)){
        return response.badRequest({ message : 'you are unable to access this platform' });
      }
      token = await generateToken(userData,JWT.ADMIN_SECRET);
    }
    if (user.loginRetryLimit){
      await userDb.updateOne({ _id :user.id },{
        loginRetryLimit:0,
        loginReactiveTime:''
      });
    }
    let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
    await userTokensDb.create({
      userId: user.id,
      token: token,
      tokenExpiredTime: expire 
    });                  
    let userToReturn = {
      ...userData,
      token 
    };
    let roleAccessData = {};
    if (roleAccess){
      const getRoleAccessData = makeGetRoleAccess({
        userRoleDb,
        routeRoleDb
      }); //Dependency Injection
      roleAccessData = await getRoleAccessData(user.id);

      if (roleAccessData.status == responseStatus.success){
        userToReturn.roleAccess = roleAccessData.data;
      }
                
    }
    return response.success({
      data:userToReturn,
      message : 'Login Successful'
    });
  } else {
    return response.badRequest({ message :'User not exists' });
  }
};

module.exports = loginUser;