/**
 *findAllUserRole.js
 */

const response = require('../../utils/response');
const findAllUserRole = ({
  userRoleDb,filterValidation 
}) => async (params,req,res) => {
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let {
    query, options, isCountOnly 
  } = params;
  let foundUserRole;
  if (isCountOnly){
    foundUserRole = await userRoleDb.count(query);
    foundUserRole = { totalRecords: foundUserRole };
  }
  else {
    foundUserRole = await userRoleDb.paginate(query,options);
    if (!foundUserRole){
      return response.recordNotFound();
    }
  }
  return response.success({ data:foundUserRole });  
};
module.exports = findAllUserRole;