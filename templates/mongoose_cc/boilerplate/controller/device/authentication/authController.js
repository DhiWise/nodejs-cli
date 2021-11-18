const dayjs = require('dayjs');

const message = require('../../../utils/messages');

function makeAuthController ({
  authService,makeUniqueValidation,userService,userTokenService,makeUser
}){
  const register = async ({ data }) => {
    try {
      const originalData = data;
      const user = makeUser(originalData, 'insertUserValidator');
      let unique = await makeUniqueValidation.uniqueValidation(user);
      if (!unique){
        return message.inValidParam({ message : 'User Registration Failed, Duplicate data found' });
      }
      const result = await userService.createDocument(user);
      return message.successResponse({ data :result });
    }
    catch (error) {
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message } );
      }
      return message.failureResponse();
    }
  };
  const forgotPassword = async (params) => {
    try {
      if (!params.email) {
        return message.insufficientParameters();
      }
      let where = { email: params.email };
      params.email = params.email.toString().toLowerCase();
      let user = await userService.getSingleDocumentByQuery(where);
      if (user) {
        let {
          resultOfEmail, resultOfSMS 
        } = await authService.sendResetPasswordNotification(user);
        if (resultOfEmail && resultOfSMS) {
          return message.requestValidated({ message :'otp successfully send.' });
    
        } else if (resultOfEmail && !resultOfSMS) {
          return message.requestValidated({ message : 'otp successfully send to your email.' });
        } else if (!resultOfEmail && resultOfSMS) {
          return message.requestValidated({ message : 'otp successfully send to your mobile number.' });
        } else {
          return message.invalidRequest({ message :'otp can not be sent due to some issue try again later' });
        }
      } else {
        return message.recordNotFound();
      }
    } catch (error) {
      return message.failureResponse();
    }
  };
    
  const validateResetPasswordOtp = async (params) => {
    try {
      if (!params || !params.otp) {
        return message.insufficientParameters();
      }
      let user = await userService.getSingleDocumentByQuery({ 'resetPasswordLink.code': params.otp });
      if (!user || !user.resetPasswordLink.expireTime) {
        return message.invalidRequest({ message : 'Invalid OTP' });
      }
      // link expire
      if (dayjs(new Date()).isAfter(dayjs(user.resetPasswordLink.expireTime))) {
        return message.invalidRequest({ message:'Your reset password link is expired.' });
      }
      return message.requestValidated({ message :'OTP Validated' });
    } catch (error) {
      return message.failureResponse();
    }
  };
    
  const resetPassword = async (params) => {
    try {
      if (!params.code || !params.newPassword) {
        return message.insufficientParameters();
      }
      let user = await userService.getSingleDocumentByQuery({ 'resetPasswordLink.code': params.code });
      if (user && user.resetPasswordLink.expireTime) {
        if (dayjs(new Date()).isAfter(dayjs(user.resetPasswordLink.expireTime))) {// link expire
          return message.invalidRequest({ message:'Your reset password link is expired.' });
        }
      } else {
        // invalid code
        return message.invalidRequest({ message :'Invalid Code' });
      }
      let response = await authService.resetPassword(user, params.newPassword);
      if (response && !response.flag) {
        return message.requestValidated({ message :response.data });
      } 
      return message.invalidRequest({ message : response.data });
    } catch (error) {
      return message.failureResponse();
    }
  };
  const authentication = async (data)=>{
    try {
      let username = data.body.username;
      let password = data.body.password;
      let url = data.url;
      if (username && password){
        let roleAccess = false;
        if (data.body.includeRoleAccess){
          roleAccess = data.body.includeRoleAccess;
        }
        let result = await authService.loginUser(username, password, url, roleAccess);
        if (!result.flag){
          return message.loginSuccess({ data:result.data });
        }
        return message.loginFailed({ message: result.data }); 
      }
      return message.insufficientParameters();
    } catch (error) {
      return message.failureResponse();
    }
  };

  const logout = async (req) => {
    try {
      if (req.user) {
        let userToken = await userTokenService.getSingleDocumentByQuery({
          token: (req.headers.authorization).replace('Bearer ', ''),
          userId:req.user.id 
        });
        let updatedDocument = { isTokenExpired : true };
        await userTokenService.updateDocument(userToken.id,updatedDocument);
        return message.requestValidated({ message:'Logged out Successfully' });
      }
      return message.badRequest();
    } catch (error) {
      return message.failureResponse();
    }
  };

  return Object.freeze({
    register,
    authentication,
    forgotPassword,
    resetPassword,
    validateResetPasswordOtp,
    logout
  });
}

module.exports = makeAuthController;