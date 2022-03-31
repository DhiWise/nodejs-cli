/**
 *softDeleteManyRouteRole.js
 */

const response = require('../../utils/response');
const softDeleteManyRouteRole = ({ routeRoleDb }) => async (params) => {
  let updatedRouteRole = await routeRoleDb.softDeleteMany(params.query, params.dataToUpdate);
  if (updatedRouteRole){
    return response.success({ data:updatedRouteRole });
  }
  return response.recordNotFound();
};
module.exports = softDeleteManyRouteRole;
