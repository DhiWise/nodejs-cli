/**
 *updateUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
const updateUserRole = ({
  userRoleDb, updateValidation
}) => async (params,req,res) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let userrole = userRoleEntity(dataToUpdate);
  userrole = await userRoleDb.updateOne(query,userrole);
  if (userrole){
    return response.success({ data:userrole });
  }
  return response.recordNotFound();
};
module.exports = updateUserRole;