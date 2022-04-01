/**
 *partialUpdateRouteRole.js
 */

const response = require('../../utils/response');
const partialUpdateRouteRole = ({ routeRoleDb }) => async (params,req,res) => {
  const routerole = await routeRoleDb.updateOne(params.query,params.dataToUpdate);
  if (!routerole){
    return response.recordNotFound();
  }
  return response.success({ data:routerole });
};
module.exports = partialUpdateRouteRole;