/**
 *softDeleteManyProjectRoute.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeSoftDeleteWithDependency = require('./deleteDependent').softDeleteWithDependency;
const response = require('../../utils/response');
const softDeleteManyProjectRoute = ({
  projectRouteDb,routeRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    isWarning, query, dataToUpdate 
  } = params;
  let countedProjectRoute = {};
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    countedProjectRoute = await getDependencyCount(query);
    return response.success({ data:countedProjectRoute });
  } else {
    const softDeleteWithDependency = makeSoftDeleteWithDependency({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    return await softDeleteWithDependency(query, dataToUpdate);
  }
};
module.exports = softDeleteManyProjectRoute;
