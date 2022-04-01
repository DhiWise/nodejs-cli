/**
 *softDeleteManyUserRole.js
 */

const response = require('../../utils/response');
const softDeleteManyUserRole = ({ userRoleDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  let deletedUserRole = await userRoleDb.softDeleteMany(query, dataToUpdate);
  if (!deletedUserRole){
    return response.recordNotFound();
  }
  return response.success({ data:deletedUserRole });
};
module.exports = softDeleteManyUserRole;
