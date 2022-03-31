
/**
 *bulkInsertRouteRole.js
 */

const  routeRoleEntity = require('../../entities/routeRole');
const response = require('../../utils/response');

const bulkInsertRouteRole = ({ routeRoleDb }) => async (dataToCreate,req,res) => {
  let routeroleEntities = dataToCreate.map(item => routeRoleEntity(item));
  let createdRouteRole = await routeRoleDb.createMany(routeroleEntities);
  return response.success({ data:createdRouteRole });
};
module.exports = bulkInsertRouteRole;