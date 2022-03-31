/**
 *addProjectRoute.js
 */

const  projectRouteEntity = require('../../entities/projectRoute');
const response = require('../../utils/response');
/**
 *
 * /**
 * @description : create documents of document of projectRoute in mongodb collection
 * @param {Object} projectRouteDb : db service instance
 * @param {Object} params : {data: data to add}
 * @return {Object} : response of create. {status, message, data}
 */
const addProjectRoute = ({
  projectRouteDb,createValidation 
}) => async (dataToCreate,req,res) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let projectRoute = projectRouteEntity(dataToCreate);
  projectRoute = await projectRouteDb.create(projectRoute);
  return response.success({ data:projectRoute });
};
module.exports = addProjectRoute;