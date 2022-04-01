
/**
 *addRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');
/**
 * @description : create documents of document of routeRole in mongodb collection
 * @param {obj} routeRoleDb : db service instance
 * @param {obj} params : {dataToCreate: data to add}
 * @return {obj} : response of create. {status, message, data}
 */
const addRouteRole = ({
  routeRoleDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let createdRouteRole  = routeRoleEntity(dataToCreate);
  createdRouteRole = await routeRoleDb.create(createdRouteRole );
  return response.success({ data:createdRouteRole });
};
module.exports = addRouteRole;