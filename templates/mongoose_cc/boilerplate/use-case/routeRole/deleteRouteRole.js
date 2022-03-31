
/**
 *deleteRouteRole.js
 */
 
const response = require('../../utils/response');
const deleteRouteRole = ({ routeRoleDb }) => async (query,req,res) => {
  let deletedRouteRole = await routeRoleDb.deleteOne(query);
  if (!deletedRouteRole){
    return response.recordNotFound({});
  }
  return response.success({ data: deletedRouteRole });
};

module.exports = deleteRouteRole;