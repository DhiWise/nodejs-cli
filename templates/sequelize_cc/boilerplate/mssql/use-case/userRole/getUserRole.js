/**
 *getUserRole.js
 */
 
const response = require('../../utils/response');
const getUserRole = ({
  userRoleDb, filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    query, options  
  } = params;
  const validateRequest = await filterValidation(options);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundUserRole = await userRoleDb.findOne(query, options);
  if (!foundUserRole){
    return response.recordNotFound();
  }
  return response.success({ data:foundUserRole });
};
module.exports = getUserRole;