const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
const responseStatus = require('../../utils/response/responseStatus');
const authConstant = require('../../constants/authConstant');
const sendPasswordBySMS = require('../common/sendPasswordBySMS'); 
const sendPasswordByEmail = require('../common/sendPasswordByEmail'); 

const register = ({ 
  userDb, 
  createValidation,
}) => async (params) => {
  let isEmptyPassword = false;
  if (!params.password){
    isEmptyPassword = true;
    params.password = Math.random().toString(36).slice(2);
  }

  let validateSchema = await createValidation(params);
  if (!validateSchema.isValid) {
    return response.validationError({ message: validateSchema.message });
  }

  let newUser = userEntity(params);

  let checkUniqueValidation = checkUnique({ userDb }); //dependance injection
  let unique = await checkUniqueValidation(params);    
    
  if (unique.status != responseStatus.success ){
    return response.badRequest({ message : 'User Registration Failed, Duplicate data found' });
  }
  const result = await userDb.create(newUser);
  if (isEmptyPassword && params.mobileNo){
    await sendPasswordBySMS({
      mobileNo: params.mobileNo,
      password: params.password
    });
  }
  if (isEmptyPassword && params.email){
    await sendPasswordByEmail({
      email: params.email,
      password: params.password
    });
  }
  return response.success({ data :result });
    
};

const checkUnique = ({ userDb }) => async (data) =>{
  let filter = { $or:[] };
  if (data && data['username']){
    filter['$or'].push(
      { 'username':data['username'] },
      { 'email':data['username'] },
    );
  }
  if (data && data['email']){
    filter['$or'].push(
      { 'username':data['email'] },
      { 'email':data['email'] },
    );
  }
  let found = await userDb.findOne(filter);
  if (found){
    return response.failure();
  }
  return response.success();
};

module.exports = register;