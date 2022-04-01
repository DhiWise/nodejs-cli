/**
 *deleteManyUser.js
 */

const makeGetDependencyCount = require('./deleteDependent').getDependencyCount;
const makeDeleteWithDependency = require('./deleteDependent').deleteWithDependency;
const response = require('../../utils/response');
const deleteManyUser = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
}) => async (params,req = {},res = {}) => {
  let {
    query,isWarning 
  } = params;
  let countedUser;
  if (isWarning){
    const getDependencyCount = makeGetDependencyCount({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    countedUser = await getDependencyCount(query);
  } else {
    const deleteWithDependency = makeDeleteWithDependency({
      userDb,
      userAuthSettingsDb,
      userTokenDb,
      userRoleDb
    }); //dependency injection
    countedUser = await deleteWithDependency(query);
  }
  return response.success({ data:countedUser });
};
module.exports = deleteManyUser;
