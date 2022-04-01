/**
 *softDeleteManyRouteRole.js
 */

const response = require('../../utils/response');
const softDeleteManyRouteRole = ({ routeRoleDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  let deletedRouteRole = await routeRoleDb.softDeleteMany(query, dataToUpdate);
  if (!deletedRouteRole){
    return response.recordNotFound();
  }
  return response.success({ data:deletedRouteRole });
};
module.exports = softDeleteManyRouteRole;
