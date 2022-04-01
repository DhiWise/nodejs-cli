
/**
 *deleteRole.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteRole = ({
  roleDb,routeRoleDb,userRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    isWarning, query 
  } = params;
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    let countedRole = await getDependencyCount(query);
    return response.success({ data:countedRole });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    let deletedRole = await deleteWithDependency(query);
    return deletedRole;
  }
};

module.exports = deleteRole;
