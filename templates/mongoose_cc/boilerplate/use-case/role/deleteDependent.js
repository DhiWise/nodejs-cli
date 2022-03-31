const response = require('../../utils/response');

const getDependencyCount = ({
  roleDb,routeRoleDb,userRoleDb
})=> async (filter) =>{
  let role = await roleDb.findMany(filter, { _id:1 });
  if (role.length){
    let roleIds = role.map((obj) => obj._id);

    const routeRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    const routeRoleCnt =  await routeRoleDb.count(routeRoleFilter);

    const userRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    const userRoleCnt =  await userRoleDb.count(userRoleFilter);
    let response = {
      routeRole : routeRoleCnt,
      userRole : userRoleCnt,
    };
    return response;
  } else {
    return {  role : 0 };
  }
};

const deleteWithDependency = ({
  roleDb,routeRoleDb,userRoleDb
})=> async (filter) =>{
  let role = await roleDb.findMany(filter, { _id:1 });
  if (role.length){
    let roleIds = role.map((obj) => obj._id);

    const routeRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    await routeRoleDb.deleteMany(routeRoleFilter);

    const userRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    await userRoleDb.deleteMany(userRoleFilter);

    let result = await roleDb.deleteMany(filter);
    return response.success({ data :result });
  } else {
    return response.badRequest({ message :'No role found.' });
  }
};

const softDeleteWithDependency = ({
  roleDb,routeRoleDb,userRoleDb
}) => async (filter,updateBody) =>{
  let role = await roleDb.findMany(filter, { _id:1 });
  if (role.length){
    let roleIds = role.map((obj) => obj._id);

    const routeRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    await routeRoleDb.updateMany(routeRoleFilter,updateBody);

    const userRoleFilter = { '$or': [{ roleId : { '$in' : roleIds } }] };
    await userRoleDb.updateMany(userRoleFilter,updateBody);

    let result = await roleDb.updateMany(filter,updateBody);
    return response.success({ data : result });
  } else {
    return response.badRequest({ message : 'No role found.' });
  }
};
module.exports = {
  getDependencyCount,
  deleteWithDependency,
  softDeleteWithDependency
};
