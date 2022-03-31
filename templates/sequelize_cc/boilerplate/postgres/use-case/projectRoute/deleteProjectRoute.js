
/**
 *deleteProjectRoute.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteProjectRoute = ({
  projectRouteDb,routeRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    isWarning, query 
  } = params;
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    let countedProjectRoute = await getDependencyCount(query);
    return response.success({ data:countedProjectRoute });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    let deletedProjectRoute = await deleteWithDependency(query);
    return deletedProjectRoute;
  }
};

module.exports = deleteProjectRoute;
