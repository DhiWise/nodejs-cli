const authService =  require('../../services/auth');
const User = require('../../model/user');
const dbService = require('../../utils/dbService');
const userTokens = require('../../model/userTokens');
const dayjs = require('dayjs');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const { uniqueValidation } = require('../../utils/common');

module.exports = {
  /*
   * api: user register 
   * description : first time user registration.
   */
  register : async (req, res) => {
    try {
      let validateRequest = validation.validateParamsWithJoi(
        req.body,
        userSchemaKey.schemaKeys
      );
      if (!validateRequest.isValid) {
        return res.inValidParam({ message :  `Invalid values in parameters, ${validateRequest.message}` });
      } 
      const data = new User({ ...req.body });
      let unique = await uniqueValidation(User,req.body);   
      if (!unique){ 
        return res.inValidParam({ message : 'User Registration Failed, Duplicate Data found' });
      } 
      const result = await dbService.createDocument(User,data);
      return res.ok({ data :result });
    } catch (error) {
      if (error.name === 'ValidationError'){
        return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
      }
      if (error.code && error.code == 11000){
        return res.isDuplicate();
      }
      return res.failureResponse();
    }  
  },
  /*
   * api : forgot password
   * description : send email or sms to user for forgot password.
   */
  forgotPassword: async (req, res) => {
    const params = req.body;
    try {
      if (!params.email) {
        return res.insufficientParameters();
      }
      let where = { email: params.email };
      params.email = params.email.toString().toLowerCase();
      let isUser = await dbService.getDocumentByQuery(User,where);
      if (isUser) {
        let {
          resultOfEmail,resultOfSMS
        } = await authService.sendResetPasswordNotification(isUser);
        if (resultOfEmail && resultOfSMS){
          return res.requestValidated({ message :'otp successfully send.' });
        } else if (resultOfEmail && !resultOfSMS) {
          return res.requestValidated({ message : 'otp successfully send to your email.' });
        } else if (!resultOfEmail && resultOfSMS) { 
          return res.requestValidated({ message : 'otp successfully send to your mobile number.' });
        } else {
          return res.failureResponse();
        }
      } else {
        return res.recordNotFound();
      }
    } catch (error) {
      return res.failureResponse();
    }
  },
  /*
   * api : validate forgot password otp 
   * description : after successfully sent mail or sms for forgot password validate otp
   */
  validateResetPasswordOtp: async (req, res) => {
    const params = req.body;
    try {
      if (!params || !params.otp) {
        return res.insufficientParameters();
      }
      let isUser = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.otp });
      if (!isUser || !isUser.resetPasswordLink.expireTime) {
        return res.invalidRequest({ message :'Invalid OTP' });
      }
      // link expire
      if (dayjs(new Date()).isAfter(dayjs(isUser.resetPasswordLink.expireTime))) {
        return res.invalidRequest( { message :'Your reset password link is expired or invalid' });
      }
      await dbService.updateDocument(User, isUser.id, { resetPasswordLink: {} });
      return res.requestValidated({ message :'Otp verified' });
    } catch (error) {
      return res.failureResponse();
    }
  },
  /*
   * api : reset password
   * description : after successfully sent email or sms for forgot password,
   *                validate otp or link and reset password
   */
  resetPassword : async (req, res) => {
    const params = req.body;
    try {
      if (!params.code || !params.newPassword) {
        return res.insufficientParameters();
      }
      let isUser = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.code });
      if (isUser && isUser.resetPasswordLink.expireTime) {
        if (dayjs(new Date()).isAfter(dayjs(isUser.resetPasswordLink.expireTime))) {// link expire
          return res.invalidRequest({ message :'Your reset password link is expired or invalid' });
        }
      } else {
        // invalid code
        return res.invalidRequest({ message :'Invalid Code' });
      }
      let response = await authService.resetPassword(isUser, params.newPassword);
      if (response && !response.flag){
        return res.requestValidated({ message :response.data });
      }
      return res.invalidRequest({ message: response.data });
    } catch (error) {
      return res.failureResponse();
    }
  },
  /*
   * api :  authentication
   * description : login user
   */
  login:async (req,res)=>{
    try {
      let {
        username,password
      } = req.body;
      let url = req.originalUrl;
      if (username && password){
        let roleAccess = false;
        if (req.body.includeRoleAccess){
          roleAccess = req.body.includeRoleAccess;
        }
        let result = await authService.loginUser(username, password, url, roleAccess);
        if (!result.flag){
          return res.loginSuccess({ data: result.data });
        }
        return res.loginFailed({ message :result.data });
      } else {
        return res.insufficientParameters();
      }
    } catch (error) {
      return res.failureResponse();
    }
  },
  /*
   * api : logout
   * description : Logout User
   */
  logout: async (req, res) => {
    try {
      if (req.user) {
        let userToken = await dbService.getDocumentByQuery(userTokens, {
          token: (req.headers.authorization).replace('Bearer ', '') ,
          userId:req.user.id
        });
        let updatedDocument = { isTokenExpired: true };
        await dbService.updateDocument(userTokens,userToken.id, updatedDocument);
        return res.requestValidated({ message :'Logged Out Successfully' });
      }
      return res.badRequest();
    } catch (error) {
      return res.failureResponse();
    }
  },
};
