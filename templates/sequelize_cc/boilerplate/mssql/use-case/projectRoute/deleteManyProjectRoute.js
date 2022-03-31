/**
 *deleteManyProjectRoute.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyProjectRoute = ({
  projectRouteDb,routeRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    query,isWarning 
  } = params;
  let countedProjectRoute;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    countedProjectRoute = await getDependencyCount(query);
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    countedProjectRoute = await deleteWithDependency(query);
  }
  return response.success({ data:countedProjectRoute });
};
module.exports = deleteManyProjectRoute;
