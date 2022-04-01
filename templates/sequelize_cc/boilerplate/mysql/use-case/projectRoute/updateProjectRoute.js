/**
 *updateProjectRoute.js
 */

const  projectRouteEntity = require('../../entities/projectRoute');
const response = require('../../utils/response');
const updateProjectRoute = ({
  projectRouteDb, updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let updatedProjectRoute = projectRouteEntity(dataToUpdate);
  updatedProjectRoute = await projectRouteDb.updateOne(query,updatedProjectRoute);
  if (!updatedProjectRoute){
    return response.recordNotFound();
  }
  return response.success({ data:updatedProjectRoute });
};
module.exports = updateProjectRoute;