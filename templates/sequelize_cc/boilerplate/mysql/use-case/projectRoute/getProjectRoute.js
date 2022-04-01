/**
 *getProjectRoute.js
 */
 
const response = require('../../utils/response');
const getProjectRoute = ({
  projectRouteDb, filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    query, options  
  } = params;
  const validateRequest = await filterValidation(options);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundProjectRoute = await projectRouteDb.findOne(query, options);
  if (!foundProjectRoute){
    return response.recordNotFound();
  }
  return response.success({ data:foundProjectRoute });
};
module.exports = getProjectRoute;