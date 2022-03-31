/**
 *softDeleteUserRole.js
 */

const response = require('../../utils/response');

const softDeleteUserRole = ({ userRoleDb }) => async (params,req = {},res = {}) => {
  let {
    query, dataToUpdate 
  } = params;
  let deletedUserRole = await userRoleDb.softDelete(query, dataToUpdate);
  if (!deletedUserRole){
    return response.recordNotFound();
  }
  return response.success({ data:deletedUserRole });
};
module.exports = softDeleteUserRole;
