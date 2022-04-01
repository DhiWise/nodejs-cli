/**
 *updateRole.js
 */

const  roleEntity = require('../../entities/role');
const response = require('../../utils/response');
const updateRole = ({
  roleDb, updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let updatedRole = roleEntity(dataToUpdate);
  updatedRole = await roleDb.updateOne(query,updatedRole);
  if (!updatedRole){
    return response.recordNotFound();
  }
  return response.success({ data:updatedRole });
};
module.exports = updateRole;