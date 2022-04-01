/**
 *softDeleteUser.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeSoftDeleteWithDependency = require('./deleteDependent').softDeleteWithDependency;
const response = require('../../utils/response');

const softDeleteUser = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    isWarning, query, dataToUpdate 
  } = params;
  let countedUser = {};
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    countedUser = await getDependencyCount(query);
    return response.success({ data:countedUser });
  } else {
    const softDeleteWithDependency = makeSoftDeleteWithDependency({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    return await softDeleteWithDependency(query, dataToUpdate);
  }
};
module.exports = softDeleteUser;
