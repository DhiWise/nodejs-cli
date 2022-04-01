
const response = require('../../utils/response');
const makeLoginUser = require('../common/loginUser'); 

const authentication = ({
  userDb,userTokenDb,userAuthSettingsDb 
}) => async (params, platform) => {
  let username = params.username;
  let password = params.password;

  if (!username || !password){
    return response.badRequest();
  }
    
  let roleAccess = null;
  if (params.includeRoleAccess){
    roleAccess = params.includeRoleAccess;
  }
  const loginUser = makeLoginUser({
    userDb,
    userTokenDb,
    userAuthSettingsDb
  });
  return result = await loginUser(username, platform, password, roleAccess);
};
module.exports = authentication;