/**
 *deleteManyRouteRole.js
 */

const response = require('../../utils/response');
const deleteManyRouteRole = ({ routeRoleDb }) => async (query,req,res) => {
  let deletedRouteRole = await routeRoleDb.deleteMany(query);
  return response.success({ data:deletedRouteRole });
};
module.exports = deleteManyRouteRole;