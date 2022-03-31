/**
 *deleteManyUser.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyUser = ({
  userDb,userTokensDb,roleDb,projectRouteDb,routeRoleDb,userRoleDb
}) => async (params,req,res) => {
  let {
    query,isWarning 
  } = params;
  let deletedUser;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      userDb,
      userTokensDb,
      roleDb,
      projectRouteDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    deletedUser = await getDependencyCount(query);
    return response.success({ data:deletedUser });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      userDb,
      userTokensDb,
      roleDb,
      projectRouteDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    deletedUser = await deleteWithDependency(query);
    return deletedUser;
  }
};
module.exports = deleteManyUser;