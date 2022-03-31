/**
 *partialUpdateRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');
const partialUpdateRouteRole = ({
  routeRoleDb,updateValidation 
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const routerole = await routeRoleDb.updateOne(query,dataToUpdate);
  if (!routerole){
    return response.recordNotFound();
  }
  return response.success({ data:routerole });
};
module.exports = partialUpdateRouteRole;