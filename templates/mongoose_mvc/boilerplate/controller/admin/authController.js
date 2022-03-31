/**
 * authController.js
 * @description :: exports authentication methods
 */

const User = require('../../model/user');
const dbService = require('../../utils/dbService');
const userTokens = require('../../model/userTokens');
const dayjs = require('dayjs');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const authConstant = require('../../constants/authConstant');
const authService =  require('../../services/auth');
const common = require('../../utils/common');

/**
 * @description : user registration 
 * @param {Object} req : request for register
 * @param {Object} res : response for register
 * @return {Object} : response for register {status, message, data}
 */
const register = async (req,res) =>{
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message :  `Invalid values in parameters, ${validateRequest.message}` });
    } 
    let isEmptyPassword = false;
    if (!req.body.password){
      isEmptyPassword = true;
      req.body.password = Math.random().toString(36).slice(2);
    }
    let unique = await common.uniqueValidation(User,req.body);   
    if (!unique){ 
      return res.validationError({ message : 'User Registration Failed, Duplicate Data found' });
    } 
    const data = new User({
      ...req.body,
      userType: authConstant.USER_TYPES.Admin
    });
    const result = await dbService.createDocument(User,data);
    if (isEmptyPassword && req.body.email){
      await authService.sendPasswordByEmail({
        email: req.body.email,
        password: req.body.password
      });
    }
    if (isEmptyPassword && req.body.mobileNo){
      await authService.sendPasswordBySMS({
        mobileNo: req.body.mobileNo,
        password: req.body.password
      });
    }
    return res.success({ data :result });
  } catch (error) {
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    if (error.code && error.code == 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ data:error.message }); 
  }  
};

/**
 * @description : login with username and password
 * @param {Object} req : request for login 
 * @param {Object} res : response for login
 * @return {Object} : response for login {status, message, data}
 */
const login = async (req,res)=>{
  try {
    let {
      username,password
    } = req.body;
    if (!username || !password){
      return res.badRequest();
    }
    let roleAccess = false;
    if (req.body.includeRoleAccess){
      roleAccess = req.body.includeRoleAccess;
    }
    let result = await authService.loginUser(username, password, authConstant.PLATFORM.ADMIN, roleAccess);
    if (result.flag){
      return res.badRequest({ message :result.data });
    }
    return res.success({ data: result.data });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : send email or sms to user with OTP on forgot password
 * @param {Object} req : request for forgotPassword
 * @param {Object} res : response for forgotPassword
 * @return {Object} : response for forgotPassword {status, message, data}
 */ 
const forgotPassword = async (req,res) => {
  const params = req.body;
  try {
    if (!params.email) {
      return res.badRequest();
    }
    let where = { email: params.email };
    params.email = params.email.toString().toLowerCase();
    let found = await dbService.getDocumentByQuery(User,where);
    if (!found) {
      return res.recordNotFound();
    }
    let {
      resultOfEmail,resultOfSMS
    } = await authService.sendResetPasswordNotification(found);
    if (resultOfEmail && resultOfSMS){
      return res.success({ message :'otp successfully send.' });
    } else if (resultOfEmail && !resultOfSMS) {
      return res.success({ message : 'otp successfully send to your email.' });
    } else if (!resultOfEmail && resultOfSMS) { 
      return res.success({ message : 'otp successfully send to your mobile number.' });
    } else {
      return res.failure({ data:error.message }); 
    }
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : validate OTP
 * @param {Object} req : request for validateResetPasswordOtp
 * @param {Object} res : response for validateResetPasswordOtp
 * @return {Object} : response for validateResetPasswordOtp  {status, message, data}
 */
const validateResetPasswordOtp = async (req,res) =>{
  const params = req.body;
  try {
    if (!params || !params.otp) {
      return res.badRequest();
    }
    let found = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.otp });
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message :'Invalid OTP' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure( { message :'Your reset password link is expired or invalid' });
    }
    await dbService.updateDocument(User, found.id, { resetPasswordLink: {} });
    return res.success({ message :'OTP verified' });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};
    
/**
 * @description : reset password with code and new password
 * @param {Object} req : request for resetPassword
 * @param {Object} res : response for resetPassword
 * @return {Object} : response for resetPassword {status, message, data}
 */ 
const resetPassword = async (req,res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.badRequest();
    }
    let found = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.code });
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message :'Invalid Code' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure({ message :'Your reset password link is expired or invalid' });
    }
    let response = await authService.resetPassword(found, params.newPassword);
    if (!response || response.flag){
      return res.failure({ message: response.data });
    }
    return res.success({ message :response.data });
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : logout user
 * @param {Object} req : request for logout
 * @param {Object} res : response for logout
 * @return {Object} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    let userToken = await dbService.getDocumentByQuery(userTokens, {
      token: (req.headers.authorization).replace('Bearer ', '') ,
      userId:req.user.id
    });
    let updatedDocument = { isTokenExpired: true };
    await dbService.updateDocument(userTokens,userToken.id, updatedDocument);
    return res.success({ message :'Logged Out Successfully' });
    return res.badRequest();
  } catch (error) {
    return res.internalServerError({ data:error.message }); 
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  validateResetPasswordOtp,
  resetPassword,
  logout
};