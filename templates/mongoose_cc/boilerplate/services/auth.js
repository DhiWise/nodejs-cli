const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,FORGOT_PASSWORD_WITH
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const dayjs = require('dayjs');
const emailService = require('./email/emailService');
const sendSMS = require('./sms/smsService');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');

async function generateToken (user,secret){
  return jwt.sign( {
    id:user.id,
    'email':user.email
  }, secret, { expiresIn: JWT.EXPIRES_IN });
}

function makeAuthService ({
  model,userService,userTokenService,userRoleService,routeRoleService
}) {
  const loginUser = async (username,password,url,roleAccess) => {
    try {
      let where = { 'email':username };
      let user = await model.findOne(where);
      if (user) {
        if (user.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT){
          let now = dayjs();
          if (user.loginReactiveTime){
            let limitTime = dayjs(user.loginReactiveTime);
            if (limitTime > now){
              let expireTime = dayjs().add(LOGIN_REACTIVE_TIME,'minute');
              if (!(limitTime > expireTime)){
                return {
                  flag:true,
                  data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,limitTime)}.`
                }; 
              }   
              await userService.updateDocument(user.id,{
                loginReactiveTime:expireTime.toISOString(),
                loginRetryLimit:user.loginRetryLimit + 1  
              });
              return {
                flag:true,
                data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
              }; 
            } else {
              user = await userService.findOneAndUpdateDocument({ _id:user.id },{
                loginReactiveTime:'',
                loginRetryLimit:0
              },{ new:true });
            }
          } else {
            // send error
            let expireTime = dayjs().add(LOGIN_REACTIVE_TIME,'minute');
            await userService.updateDocument(user.id,{
              loginReactiveTime:expireTime.toISOString(),
              loginRetryLimit:user.loginRetryLimit + 1 
            });
            return {
              flag:true,
              data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
            }; 
          } 
        }
        const isPasswordMatched = await user.isPasswordMatch(password);
        if (isPasswordMatched) {
          const userData = user.toJSON();
          let token;
          if (!user.role) {
            return {
              flag:true,
              data:'You have not been assigned role.'
            };
          }
          if (url.includes('device')){
            if (!LOGIN_ACCESS[user.role].includes(PLATFORM.DEVICE)){
              return {
                flag:true,
                data:'you are unable to access this platform'
              };
            }
            token = await generateToken(userData,JWT.DEVICE_SECRET);
          }
          else if (url.includes('admin')){
            if (!LOGIN_ACCESS[user.role].includes(PLATFORM.ADMIN)){
              return {
                flag:true,
                data:'you are unable to access this platform'
              };
            }
            token = await generateToken(userData,JWT.ADMIN_SECRET);
          }
          if (user.loginRetryLimit){
            await userService.updateDocument(user.id,{
              loginRetryLimit:0,
              loginReactiveTime:''
            });
          }
          let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
          await userTokenService.createDocument({
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
            roleAccessData = await common.getRoleAccessData(userRoleService,routeRoleService,user.id);
            userToReturn = {
              ...userToReturn,
              roleAccess: roleAccessData
            };
          }
          return {
            flag:false,
            data:userToReturn
          };
        } else {
          await userService.updateDocument(user.id,{ loginRetryLimit:user.loginRetryLimit + 1 });
          return {
            flag:true,
            data:'incorrect password'
          };
        }
      } else {
        return {
          flag:true,
          data:'User not exists'
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const changePassword = async (params) => {
    try {
      let password = params.newPassword;
      let oldPassword = params.oldPassword;
      let user = await userService.getSingleDocumentById(params.userId);
      if (user && user.id) {
        let isPasswordMatch = await user.isPasswordMatch(oldPassword);
        if (!isPasswordMatch){
          return {
            flag:true,
            data:'Incorrect old password'
          };
        }
        password = await bcrypt.hash(password, 8);
        let updatedUser = userService.updateDocument(user.id, { password:password });
        if (updatedUser) {
          return {
            flag:false,
            data:'Password changed successfully.'
          };
        }
        return {
          flag:true,
          data:'Password not updated'
        };
      }
      return {
        flag:true,
        data:'User not found'
      };
    } catch (error) {
      throw new Error(error);
    }
  };

  const sendResetPasswordNotification = async (user) => {
    let resultOfEmail = false;
    let resultOfSMS = false;
    try {
      let token = uuid();
      let expires = dayjs();
      expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minute').toISOString();
      await userService.updateDocument(user.id,
        {
          resetPasswordLink: {
            code: token,
            expireTime: expires 
          } 
        });
      if (FORGOT_PASSWORD_WITH.LINK.email){
        let viewType = '/reset-password/';
        let msg = 'Click on the link below to reset your password.';
        let mailObj = {
          subject: 'Reset Password',
          to: user.email,
          template: '/views/resetPassword',
          data: {
            link: `http://localhost:${process.env.PORT}` + viewType + token,
            linkText: 'Reset Password',
            message:msg
          }
        };
        try {
          await emailService.sendMail(mailObj);
          resultOfEmail  = true;
        } catch (error){
          console.log(error);
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
          await sendSMS(smsObj);
          resultOfSMS = true;
        } catch (error){
          console.log(error);
        }
      }
      return {
        resultOfEmail,
        resultOfSMS 
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };
    
  const resetPassword = async (user, newPassword) => {
    try {
      let where = { _id: user.id };
      const dbUser = await userService.getSingleDocumentByQuery(where);
      if (!dbUser) {
        return {
          flag: true,
          data: 'user not found',
        };
      }
      newPassword = await bcrypt.hash(newPassword, 8);
      await userService.updateDocument(user.id, {
        password: newPassword,
        resetPasswordLink: null,
        loginRetryLimit:0
      });
      let mailObj = {
        subject: 'Reset Password',
        to: user.email,
        template: '/views/successfullyResetPassword',
        data: {
          isWidth: true,
          email: user.email || '-',
          message: 'Password Successfully Reset'
        }
      };
      await emailService.sendMail(mailObj);
      return {
        flag: false,
        data: 'Password reset successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  };
    
  return Object.freeze({
    loginUser,
    changePassword,
    resetPassword,
    sendResetPasswordNotification,
  });
}

module.exports = makeAuthService;