/**
 *deleteManyProjectRoute.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyProjectRoute = ({
  projectRouteDb,routeRoleDb
}) => async (params,req,res) => {
  let {
    query,isWarning 
  } = params;
  let deletedProjectRoute;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    deletedProjectRoute = await getDependencyCount(query);
    return response.success({ data:deletedProjectRoute });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    deletedProjectRoute = await deleteWithDependency(query);
    return deletedProjectRoute;
  }
};
module.exports = deleteManyProjectRoute;