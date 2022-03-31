/**
 *addRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');
/**
 *
 * /**
 * @description : create documents of document of routeRole in mongodb collection
 * @param {Object} routeRoleDb : db service instance
 * @param {Object} params : {data: data to add}
 * @return {Object} : response of create. {status, message, data}
 */
const addRouteRole = ({
  routeRoleDb,createValidation 
}) => async (dataToCreate,req,res) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let routeRole = routeRoleEntity(dataToCreate);
  routeRole = await routeRoleDb.create(routeRole);
  return response.success({ data:routeRole });
};
module.exports = addRouteRole;