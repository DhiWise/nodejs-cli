/**
 *softDeleteManyUserRole.js
 */

const response = require('../../utils/response');
const softDeleteManyUserRole = ({ userRoleDb }) => async (params) => {
  let updatedUserRole = await userRoleDb.softDeleteMany(params.query, params.dataToUpdate);
  if (updatedUserRole){
    return response.success({ data:updatedUserRole });
  }
  return response.recordNotFound();
};
module.exports = softDeleteManyUserRole;
