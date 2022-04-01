/**
 *softDeleteManyProjectRoute.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeSoftDeleteWithDependency = require('./deleteDependent').softDeleteWithDependency;
const response = require('../../utils/response');
const softDeleteManyProjectRoute = ({
  projectRouteDb,routeRoleDb
}) => async (params,req,res) => {
  let {
    query, dataToUpdate,isWarning 
  } = params;
  let updatedProjectRoute = {};
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    updatedProjectRoute = await getDependencyCount(query);
    return response.success({ data:updatedProjectRoute });
  } else {
    const softDeleteWithDependency = makeSoftDeleteWithDependency({
      projectRouteDb,
      routeRoleDb
    }); //dependency injection
    updatedProjectRoute = await softDeleteWithDependency(query, dataToUpdate);
    return updatedProjectRoute;
  }
};
module.exports = softDeleteManyProjectRoute;
