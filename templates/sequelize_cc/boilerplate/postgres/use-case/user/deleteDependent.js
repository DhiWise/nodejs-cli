const response = require('../../utils/response');

const getDependencyCount = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
})=> async (filter) =>{
  let user = await userDb.findMany(filter, { id:1 });
  if (user.length){
    let userIds = user.map((obj) => obj.id);

    const userFilter = { '$or': [{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    const userCnt =  await userDb.count(userFilter);

    const userAuthSettingsFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    const userAuthSettingsCnt =  await userAuthSettingsDb.count(userAuthSettingsFilter);

    const userTokenFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    const userTokenCnt =  await userTokenDb.count(userTokenFilter);

    const userRoleFilter = { '$or': [{ userId : { '$in' : userIds } }] };
    const userRoleCnt =  await userRoleDb.count(userRoleFilter);
    let result = {
      user : userCnt,
      userAuthSettings : userAuthSettingsCnt,
      userToken : userTokenCnt,
      userRole : userRoleCnt,
    };
    return result;
  } else {
    return {  user : 0 };
  }
};

const deleteWithDependency = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
})=> async (filter) =>{
  let user = await userDb.findMany(filter, { id:1 });
  if (user.length){
    let userIds = user.map((obj) => obj.id);

    const userFilter = { '$or': [{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userDb.deleteMany(userFilter);

    const userAuthSettingsFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userAuthSettingsDb.deleteMany(userAuthSettingsFilter);

    const userTokenFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userTokenDb.deleteMany(userTokenFilter);

    const userRoleFilter = { '$or': [{ userId : { '$in' : userIds } }] };
    await userRoleDb.deleteMany(userRoleFilter);

    let result = await userDb.deleteMany(filter);
    return response.success({ data :result });
  } else {
    return response.badRequest({ message :'No user found.' });
  }
};

const softDeleteWithDependency = ({
  userDb,userAuthSettingsDb,userTokenDb,userRoleDb
}) => async (filter,updateBody) =>{
  let user = await userDb.findMany(filter, { id:1 });
  if (user.length){
    let userIds = user.map((obj) => obj.id);

    const userFilter = { '$or': [{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userDb.updateMany(userFilter,updateBody);

    const userAuthSettingsFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userAuthSettingsDb.updateMany(userAuthSettingsFilter,updateBody);

    const userTokenFilter = { '$or': [{ userId : { '$in' : userIds } },{ addedBy : { '$in' : userIds } },{ updatedBy : { '$in' : userIds } }] };
    await userTokenDb.updateMany(userTokenFilter,updateBody);

    const userRoleFilter = { '$or': [{ userId : { '$in' : userIds } }] };
    await userRoleDb.updateMany(userRoleFilter,updateBody);

    let result = await userDb.updateMany(filter,updateBody);
    return response.success({ data : result });
  } else {
    return response.badRequest({ message : 'No user found.' });
  }
};
module.exports = {
  getDependencyCount,
  deleteWithDependency,
  softDeleteWithDependency
};
