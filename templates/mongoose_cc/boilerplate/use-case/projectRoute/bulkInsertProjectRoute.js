
/**
 *bulkInsertProjectRoute.js
 */

const  projectRouteEntity = require('../../entities/projectRoute');
const response = require('../../utils/response');

const bulkInsertProjectRoute = ({ projectRouteDb }) => async (dataToCreate,req,res) => {
  let projectrouteEntities = dataToCreate.map(item => projectRouteEntity(item));
  let createdProjectRoute = await projectRouteDb.createMany(projectrouteEntities);
  return response.success({ data:createdProjectRoute });
};
module.exports = bulkInsertProjectRoute;