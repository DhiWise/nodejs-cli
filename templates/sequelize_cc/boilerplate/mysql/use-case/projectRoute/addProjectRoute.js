
/**
 *addProjectRoute.js
 */

const  projectRouteEntity = require('../../entities/projectRoute');
const response = require('../../utils/response');
/**
 * @description : create documents of document of projectRoute in mongodb collection
 * @param {obj} projectRouteDb : db service instance
 * @param {obj} params : {dataToCreate: data to add}
 * @return {obj} : response of create. {status, message, data}
 */
const addProjectRoute = ({
  projectRouteDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let createdProjectRoute  = projectRouteEntity(dataToCreate);
  createdProjectRoute = await projectRouteDb.create(createdProjectRoute );
  return response.success({ data:createdProjectRoute });
};
module.exports = addProjectRoute;