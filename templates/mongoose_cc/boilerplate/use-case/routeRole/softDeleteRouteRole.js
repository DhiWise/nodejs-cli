/**
 *softDeleteRouteRole.js
 */

const response = require('../../utils/response');

const softDeleteRouteRole = ({ routeRoleDb }) => async (params,req,res) => {
  let updatedRouteRole = await routeRoleDb.softDelete(params.query, params.dataToUpdate);
  if (!updatedRouteRole){
    return response.recordNotFound();   
  }
  return response.success({ data:updatedRouteRole });
};
module.exports = softDeleteRouteRole;