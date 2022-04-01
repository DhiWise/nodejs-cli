/**
 *findAllRouteRole.js
 */

const response = require('../../utils/response');
const findAllRouteRole = ({
  routeRoleDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    options, query, isCountOnly 
  } = params;
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundRouteRole;
  if (isCountOnly){
    foundRouteRole = await routeRoleDb.count(query);
    foundRouteRole = { totalRecords: foundRouteRole };
    return response.success({ data:foundRouteRole });  
  }
  else {
    foundRouteRole = await routeRoleDb.paginate(query,options);
    if (!foundRouteRole){
      return response.recordNotFound();
    }
    return response.success({ data:foundRouteRole });
  }
};
module.exports = findAllRouteRole;