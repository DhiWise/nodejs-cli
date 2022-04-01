/**
 *updateUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
const updateUserRole = ({
  userRoleDb, updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let updatedUserRole = userRoleEntity(dataToUpdate);
  updatedUserRole = await userRoleDb.updateOne(query,updatedUserRole);
  if (!updatedUserRole){
    return response.recordNotFound();
  }
  return response.success({ data:updatedUserRole });
};
module.exports = updateUserRole;