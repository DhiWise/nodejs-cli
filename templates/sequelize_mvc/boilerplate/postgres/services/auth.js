/**
 * auth.js
 * @description :: service functions used in authentication
 */

const model = require('../model/index');
const dbService = require('../utils/dbService');
const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,FORGOT_PASSWORD_WITH
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const emailService = require('./email');
const smsService = require('./sms');
const { Op } = require('sequelize');
const uuid = require('uuid').v4;

/**
 * @description : service to generate JWT token for authentication.
 * @param {obj} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user,secret) => {
  return jwt.sign( {
    id:user.id,
    'username':user.username
  }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

let auth =  module.exports = {};
/**
 * @description : service of login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @param {string} platform : platform.
 * @param {boolean} roleAccess: a flag to request user`s role access
 * @return {obj} : returns authentication status. {flag, data}
 */
auth.loginUser = async (username,password,platform,roleAccess) => {
  try {
    let where = { [Op.or]:[{ username:username },{ email:username }] };
    const user = await dbService.findOne(model.user,where);
    if (!user) {
      return {
        flag:true,
        data:'User not exists'
      };
    } 
    let userAuth = await dbService.findOne(model.userAuthSettings, { userId: user.id });
    if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
      let now = dayjs();
      if (userAuth.loginReactiveTime) {
        let limitTime = dayjs(userAuth.loginReactiveTime);
        if (limitTime > now) {
          let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
          if (!(limitTime > expireTime)){
            return {
              flag:true,
              data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,limitTime)}.`
            }; 
          }  
          await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
            loginReactiveTime: expireTime.toISOString(),
            loginRetryLimit: userAuth.loginRetryLimit + 1
          });
          return {
            flag: true,
            data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
          };
        } else {
          await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
            loginReactiveTime: null,
            loginRetryLimit: 0
          });
          userAuth = await dbService.findOne(model.userAuthSettings, { userId: user.id });
        }
      } else {
        // send error
        let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
        await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
          loginReactiveTime: expireTime.toISOString(),
          loginRetryLimit: userAuth.loginRetryLimit + 1
        });
        return {
          flag: true,
          data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
        };
      }
    }
    if (password){
      let isPasswordMatched  = await user.isPasswordMatch(password);
      if (!isPasswordMatched){
        await dbService.updateMany(model.userAuthSettings,{ userId:user.id },{ loginRetryLimit:userAuth.loginRetryLimit + 1 });
        return {
          flag:true,
          data:'Incorrect Password'
        };
      }
    }
    const userData = user.toJSON();
    let token;
    if (!user.userType){
      return {
        flag:true,
        data:'You have not assigned any role'
      };
    }
    if (platform == PLATFORM.DEVICE){
      if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.DEVICE)){
        return {
          flag:true,
          data:'you are unable to access this platform'
        };
      }
      token = await generateToken(userData,JWT.DEVICE_SECRET);
    }
    else if (platform == PLATFORM.ADMIN){
      if (!LOGIN_ACCESS[user.userType].includes(PLATFORM.ADMIN)){
        return {
          flag:true,
          data:'you are unable to access this platform'
        };
      }
      token = await generateToken(userData,JWT.ADMIN_SECRET);
    }
    if (userAuth && userAuth.loginRetryLimit){
      await dbService.updateMany(model.userAuthSettings, { userId:user.id }, {
        loginRetryLimit: 0,
        loginReactiveTime: null
      });
    }
    let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
    await dbService.createOne(model.userToken, {
      userId: user.id,
      token: token,
      tokenExpiredTime: expire 
    });
    let userToReturn = {
      ...userData,
      ...{ token } 
    };
    let roleAccessData = {};
    if (roleAccess){
      roleAccessData = await common.getRoleAccessData(model,user.id);
      userToReturn = {
        ...userToReturn,
        roleAccess: roleAccessData
      };
    }
    return {
      flag:false,
      data:userToReturn
    };
                    
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to change password.
 * @param {obj} params : object of new password, old password and user`s id.
 * @return {obj}  : returns status of change password. {flag,data}
 */
auth.changePassword = async (params)=>{
  try {
    let password = params.newPassword;
    let oldPassword = params.oldPassword;
    let where = { id:params.userId };
    let user = await dbService.findOne(model.user,where);
    if (!user || !user.id) {
      return {
        flag:true,
        data:'User not found'
      };
    }
    const isPasswordMatched = await user.isPasswordMatch(oldPassword);
    if (!isPasswordMatched){
      return {
        flag:true,
        data:'Incorrect Old Password'
      };
    }
    password = await bcrypt.hash(password, 8);
    let updatedUser = dbService.updateByPk(model.user,user.id,{ password:password });
    if (!updatedUser) {
      return {
        flag:true,
        data:'password can not changed due to some error.please try again'
      };
    }
    return {
      flag:false,
      data:'Password changed successfully'
    };                
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to send notification on reset password.
 * @param {obj} user : user document
 * @return {}  : returns status where notification is sent or not
 */
auth.sendResetPasswordNotification = async (user) => {
  let resultOfEmail = false;
  let resultOfSMS = false;
  try {
    let token = uuid();
    let expires = dayjs();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
    await dbService.updateMany(model.userAuthSettings, { userId:user.id },
      {
        resetPasswordCode: token,
        expiredTimeOfResetPasswordCode: expires
      });
    if (FORGOT_PASSWORD_WITH.LINK.email){
      let viewType = '/reset-password/';
      let msg = 'Click on the link below to reset your password.';
      let mailObj = {
        subject: 'Reset Password',
        to: user.email,
        template: '/views/email/ResetPassword',
        data: {
          userName: user.username || '-',
          link: `http://localhost:${process.env.PORT}` + viewType + token,
          linkText: 'Reset Password',
          message:msg
        }
      };
      try {
        await emailService.sendMail(mailObj);
        resultOfEmail = true;
      } catch (error){
        throw new Error(error.message);
      }
    }
    if (FORGOT_PASSWORD_WITH.LINK.sms){
      let viewType = '/reset-password/';
      let msg = `Click on the link to reset your password.
            http://localhost:${process.env.PORT}${viewType + token}`;
      let smsObj = {
        to:user.mobileNo,
        message:msg
      };
      try {
        await smsService.sendSMS(smsObj);
        resultOfSMS = true;
      } catch (error){
        throw new Error(error.message);
      }
    }
    return {
      resultOfEmail,
      resultOfSMS
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to reset password.
 * @param {obj} userId : user`s id 
 * @param {string} newPassword : new password to be set.
 * @return {}  : returns status whether new password is set or not. {flag, data}
 */
auth.resetPassword = async (userId, newPassword) => {
  try {
    let where = { id: userId };
    const dbUser = await dbService.findOne(model.user,where);
    if (!dbUser) {
      return {
        flag: true,
        data: 'User not found',
      };
    }
    newPassword = await bcrypt.hash(newPassword, 8);
    let updatedUser = await dbService.updateByPk(model.user, userId, { password: newPassword });
    if (!updatedUser) {
      return {
        flag: true,
        data: 'Password is not reset successfully',
      };
    }
    await dbService.updateMany(model.userAuthSettings, { userId:userId }, {
      resetPasswordCode: '',
      expiredTimeOfResetPasswordCode: null,
      loginRetryLimit: 0 
    });
    let mailObj = {
      subject: 'Reset Password',
      to: dbUser.email,
      template: '/views/email/successfullyResetPassword',
      data: {
        isWidth: true,
        email: dbUser.email || '-',
        message: 'Password Successfully Reset'
      }
    };
    await emailService.sendMail(mailObj);
    return {
      flag: false,
      data: 'Password reset successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to send password via SMS.
 * @param {string} user : user document.
 * @return {boolean}  : returns status whether SMS is sent or not.
 */
auth.sendPasswordBySMS = async (user) => {
  try {
    let message = `Password for login as`;
    let msg = `${message} : ${user.password}`;
    let smsObj = {
      to: user.mobileNo,
      message: msg
    };
    await smsService.sendSMS(smsObj);
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * @description : service to send password via Email.
 * @param {string} user : user document.
 * @return {boolean}  : returns status whether Email is sent or not.
 */
auth.sendPasswordByEmail = async (user) => {
  try {
    let msg = `Your Password for login : ${user.password}`;
    let mailObj = {
      subject: 'Your Password!',
      to: user.email,
      template: '/views/email/passwordTemplate',
      data: { message:msg }
    };
    try {
      await emailService.sendMail(mailObj);
      return true;
    } catch (error) {
      return false;
    }
  } catch (error) {
    return false;
  }
};
