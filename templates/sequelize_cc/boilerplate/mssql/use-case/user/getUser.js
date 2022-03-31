/**
 *getUser.js
 */
 
const response = require('../../utils/response');
const getUser = ({
  userDb, filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    query, options  
  } = params;
  const validateRequest = await filterValidation(options);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundUser = await userDb.findOne(query, options);
  if (!foundUser){
    return response.recordNotFound();
  }
  return response.success({ data:foundUser });
};
module.exports = getUser;