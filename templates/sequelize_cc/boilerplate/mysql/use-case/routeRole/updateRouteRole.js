/**
 *updateRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');
const updateRouteRole = ({
  routeRoleDb, updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let updatedRouteRole = routeRoleEntity(dataToUpdate);
  updatedRouteRole = await routeRoleDb.updateOne(query,updatedRouteRole);
  if (!updatedRouteRole){
    return response.recordNotFound();
  }
  return response.success({ data:updatedRouteRole });
};
module.exports = updateRouteRole;