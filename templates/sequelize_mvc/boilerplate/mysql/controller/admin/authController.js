/**
 * authController.js
 * @description :: exports authentication methods
 */
const authService =  require('../../services/auth');
const model = require('../../model/index');
const dbService = require('../../utils/dbService');
const dayjs = require('dayjs');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const authConstant = require('../../constants/authConstant');
const { uniqueValidation } = require('../../utils/common');
const {
  sendPasswordBySMS, sendPasswordByEmail 
} = require('../../services/auth');
    
/**
 * @description : user registration 
 * @param {Object} req : request for register
 * @param {Object} res : response for register
 * @return {Object} : response for register {status, message, data}
 */
const register = async (req, res) => {
  try {
    let dataToRegister = req.body;
    let validateRequest = validation.validateParamsWithJoi(
      dataToRegister,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let isEmptyPassword = false;
    if (!dataToRegister.password){
      isEmptyPassword = true;
      dataToRegister.password = Math.random().toString(36).slice(2);
    }
    let unique = await uniqueValidation(model.user,dataToRegister);   
    if (!unique){ 
      return res.validationError({ message :'User Registration Failed, Duplicate Data found.' });
    }   
    const result = await dbService.createOne(model.user,{
      ...dataToRegister,
      userType: authConstant.USER_TYPES.Admin
    });
    if (isEmptyPassword && req.body.email){
      await sendPasswordByEmail({
        email: req.body.email,
        password: req.body.password
      });
    }
    if (isEmptyPassword && req.body.mobileNo){
      await sendPasswordBySMS({
        mobileNo: req.body.mobileNo,
        password: req.body.password
      });
    }
    return  res.success({ data :result });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }  
};

/**
 * @description : send email or sms to user with OTP on forgot password
 * @param {Object} req : request for forgotPassword
 * @param {Object} res : response for forgotPassword
 * @return {Object} : response for forgotPassword {status, message, data}
 */
const forgotPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.email) {
      return res.badRequest();
    }
    let where = { email: params.email.toString().toLowerCase() };
    let found = await dbService.findOne(model.user,where);
    if (!found) {
      return res.recordNotFound();
    } 
    let {
      resultOfEmail,resultOfSMS
    } = await authService.sendResetPasswordNotification(found);
    if (resultOfEmail && resultOfSMS){
      return res.success({ message :'OTP successfully send.' });
    } else if (resultOfEmail && !resultOfSMS) {
      return res.success({ message :'OTP successfully send to your email.' });
    } else if (!resultOfEmail && resultOfSMS) { 
      return res.success({ message : 'OTP successfully send to your mobile number.' });
    } else {
      return res.failure({ message :'OTP can not be sent due to some issue try again later' });
    }
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : validate OTP
 * @param {Object} req : request for validateResetPasswordOtp
 * @param {Object} res : response for validateResetPasswordOtp
 * @return {Object} : response for validateResetPasswordOtp  {status, message, data}
 */ 
const validateResetPasswordOtp = async (req, res) => {
  const params = req.body;
  try {
    if (!params || !params.otp) {
      return res.badRequest();
    }
    let found = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.otp });
    if (!found || !found.resetPasswordCode) {
      return res.failure({ message :'Invalid OTP' });
    }
    // link expire
    if (dayjs(new Date()).isAfter(dayjs(found.expiredTimeOfResetPasswordCode))) {
      return res.failure({ message :'Your reset password link is expired or invalid' });
    }
    return res.success({ message : 'OTP verified' });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : reset password with code and new password
 * @param {Object} req : request for resetPassword
 * @param {Object} res : response for resetPassword
 * @return {Object} : response for resetPassword {status, message, data}
 */ 
const resetPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.badRequest();
    }
    let userAuth = await dbService.findOne(model.userAuthSettings, { resetPasswordCode: params.code });
    if (userAuth && userAuth.expiredTimeOfResetPasswordCode) {
      if (dayjs(new Date()).isAfter(dayjs(userAuth.expiredTimeOfResetPasswordCode))) {// link expire
        return res.failure({ message :'Your reset password link is expired or invalid' });
      }
    } else {
      // invalid code
      return res.failure({ message :'Invalid Code' });
    }
    let response = await authService.resetPassword(userAuth.userId, params.newPassword);
    if (response.flag){
      return res.failure({ message :response.data });
    }
    return res.success({ message  :response.data });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
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
    if (username && password){
      let roleAccess = false;
      if (req.body.includeRoleAccess){
        roleAccess = req.body.includeRoleAccess;
      }
      let result = await authService.loginUser(username, password, authConstant.PLATFORM.ADMIN, roleAccess);
      if (result.flag){
        return res.badRequest({ message:result.data });
      }
      return res.success({
        data:result.data,
        message :'Login successful.'
      });
    } else {
      return res.badRequest();
    }
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
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
    if (!req.user) {
      return res.badRequest();
    }
    let userTokens = await dbService.findOne(model.userToken, {
      token: (req.headers.authorization).replace('Bearer ', ''),
      userId:req.user.id 
    });
    userTokens.isTokenExpired = true;
    let id = userTokens.id;
    delete userTokens.id;
    await dbService.updateByPk(model.userToken,id, userTokens.toJSON());
    return res.success({ message :'Logged Out Successfully' });

  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
module.exports = {
  register,
  login,
  forgotPassword,
  validateResetPasswordOtp,
  resetPassword,
  logout,
};
