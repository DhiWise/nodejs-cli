
/**
 *deleteUser.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteUser = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    isWarning, query 
  } = params;
  if (isWarning) {
    const getDependencyCount = makeGetDependencyCount({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    let countedUser = await getDependencyCount(query);
    return response.success({ data:countedUser });
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    let deletedUser = await deleteWithDependency(query);
    return deletedUser;
  }
};

module.exports = deleteUser;
