/**
 *softDeleteManyUser.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeSoftDeleteWithDependency = require('./deleteDependent').softDeleteWithDependency;
const response = require('../../utils/response');
const softDeleteManyUser = ({
  userDb,userTokensDb,roleDb,projectRouteDb,routeRoleDb,userRoleDb
}) => async (params,req,res) => {
  let {
    query, dataToUpdate,isWarning 
  } = params;
  let updatedUser = {};
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      userDb,
      userTokensDb,
      roleDb,
      projectRouteDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    updatedUser = await getDependencyCount(query);
    return response.success({ data:updatedUser });
  } else {
    const softDeleteWithDependency = makeSoftDeleteWithDependency({
      userDb,
      userTokensDb,
      roleDb,
      projectRouteDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    updatedUser = await softDeleteWithDependency(query, dataToUpdate);
    return updatedUser;
  }
};
module.exports = softDeleteManyUser;
