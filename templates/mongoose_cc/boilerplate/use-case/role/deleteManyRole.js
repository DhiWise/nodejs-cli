/**
 *deleteManyRole.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyRole = ({
  roleDb,routeRoleDb,userRoleDb
}) => async (params,req,res) => {
  let {
    query,isWarning 
  } = params;
  let deletedRole;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    deletedRole = await getDependencyCount(query);
    return response.success({ data:deletedRole });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    deletedRole = await deleteWithDependency(query);
    return deletedRole;
  }
};
module.exports = deleteManyRole;