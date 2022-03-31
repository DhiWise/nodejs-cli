const response = require('../../utils/response');

const getDependencyCount = ({
  projectRouteDb,routeRoleDb
})=> async (filter) =>{
  let projectRoute = await projectRouteDb.findMany(filter, { id:1 });
  if (projectRoute.length){
    let projectRouteIds = projectRoute.map((obj) => obj.id);

    const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectRouteIds } }] };
    const routeRoleCnt =  await routeRoleDb.count(routeRoleFilter);
    let result = { routeRole : routeRoleCnt, };
    return result;
  } else {
    return {  projectRoute : 0 };
  }
};

const deleteWithDependency = ({
  projectRouteDb,routeRoleDb
})=> async (filter) =>{
  let projectRoute = await projectRouteDb.findMany(filter, { id:1 });
  if (projectRoute.length){
    let projectRouteIds = projectRoute.map((obj) => obj.id);

    const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectRouteIds } }] };
    await routeRoleDb.deleteMany(routeRoleFilter);

    let result = await projectRouteDb.deleteMany(filter);
    return response.success({ data :result });
  } else {
    return response.badRequest({ message :'No projectRoute found.' });
  }
};

const softDeleteWithDependency = ({
  projectRouteDb,routeRoleDb
}) => async (filter,updateBody) =>{
  let projectRoute = await projectRouteDb.findMany(filter, { id:1 });
  if (projectRoute.length){
    let projectRouteIds = projectRoute.map((obj) => obj.id);

    const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectRouteIds } }] };
    await routeRoleDb.updateMany(routeRoleFilter,updateBody);

    let result = await projectRouteDb.updateMany(filter,updateBody);
    return response.success({ data : result });
  } else {
    return response.badRequest({ message : 'No projectRoute found.' });
  }
};
module.exports = {
  getDependencyCount,
  deleteWithDependency,
  softDeleteWithDependency
};
