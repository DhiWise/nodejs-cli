/**
 *getRouteRole.js
 */
 
const response = require('../../utils/response');
const getRouteRole = ({
  routeRoleDb, filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    query, options  
  } = params;
  const validateRequest = await filterValidation(options);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundRouteRole = await routeRoleDb.findOne(query, options);
  if (!foundRouteRole){
    return response.recordNotFound();
  }
  return response.success({ data:foundRouteRole });
};
module.exports = getRouteRole;