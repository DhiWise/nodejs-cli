/**
 *deleteManyRole.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyRole = ({
  roleDb,routeRoleDb,userRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    query,isWarning 
  } = params;
  let countedRole;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    countedRole = await getDependencyCount(query);
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    countedRole = await deleteWithDependency(query);
  }
  return response.success({ data:countedRole });
};
module.exports = deleteManyRole;
