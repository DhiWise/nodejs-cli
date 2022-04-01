/**
 *findAllProjectRoute.js
 */

const response = require('../../utils/response');
const findAllProjectRoute = ({
  projectRouteDb,filterValidation 
}) => async (params,req,res) => {
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let {
    query, options, isCountOnly 
  } = params;
  let foundProjectRoute;
  if (isCountOnly){
    foundProjectRoute = await projectRouteDb.count(query);
    foundProjectRoute = { totalRecords: foundProjectRoute };
  }
  else {
    foundProjectRoute = await projectRouteDb.paginate(query,options);
    if (!foundProjectRoute){
      return response.recordNotFound();
    }
  }
  return response.success({ data:foundProjectRoute });  
};
module.exports = findAllProjectRoute;