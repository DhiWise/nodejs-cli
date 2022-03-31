/**
 *updateRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');
const updateRouteRole = ({
  routeRoleDb, updateValidation
}) => async (params,req,res) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let routerole = routeRoleEntity(dataToUpdate);
  routerole = await routeRoleDb.updateOne(query,routerole);
  if (routerole){
    return response.success({ data:routerole });
  }
  return response.recordNotFound();
};
module.exports = updateRouteRole;