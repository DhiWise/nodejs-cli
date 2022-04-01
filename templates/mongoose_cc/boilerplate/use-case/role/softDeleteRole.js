/**
 *softDeleteRole.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeSoftDeleteWithDependency = require('./deleteDependent').softDeleteWithDependency;
const response = require('../../utils/response');

const softDeleteRole = ({
  roleDb,routeRoleDb,userRoleDb
}) => async (params,req,res) => {
  let {
    query, dataToUpdate,isWarning 
  } = params;
  let updatedRole = {};
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    updatedRole = await getDependencyCount(query);
    return response.success({ data:updatedRole });
  } else {
    const softDeleteWithDependency = makeSoftDeleteWithDependency({
      roleDb,
      routeRoleDb,
      userRoleDb
    }); //dependency injection
    updatedRole = await softDeleteWithDependency(query, dataToUpdate);
    return updatedRole;
  }
};
module.exports = softDeleteRole;