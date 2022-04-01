/**
 *softDeleteRouteRole.js
 */

const response = require('../../utils/response');

const softDeleteRouteRole = ({ routeRoleDb }) => async (params,req = {},res = {}) => {
  let {
    query, dataToUpdate 
  } = params;
  let deletedRouteRole = await routeRoleDb.softDelete(query, dataToUpdate);
  if (!deletedRouteRole){
    return response.recordNotFound();
  }
  return response.success({ data:deletedRouteRole });
};
module.exports = softDeleteRouteRole;
