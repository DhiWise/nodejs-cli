/**
 *softDeleteUserRole.js
 */

const response = require('../../utils/response');

const softDeleteUserRole = ({ userRoleDb }) => async (params,req,res) => {
  let updatedUserRole = await userRoleDb.softDelete(params.query, params.dataToUpdate);
  if (!updatedUserRole){
    return response.recordNotFound();   
  }
  return response.success({ data:updatedUserRole });
};
module.exports = softDeleteUserRole;