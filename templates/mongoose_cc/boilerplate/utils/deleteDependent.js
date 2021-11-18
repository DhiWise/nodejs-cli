const db = require('mongoose');
let User = require('../model/user')(db);
let UserTokens = require('../model/userTokens')(db);
let Role = require('../model/role')(db);
let ProjectRoute = require('../model/projectRoute')(db);
let RouteRole = require('../model/routeRole')(db);
let UserRole = require('../model/userRole')(db);

const deleteUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter9760 = { 'addedBy': { '$in': user } };
      const user7014 = await deleteUser(userFilter9760);
      const userFilter5773 = { 'updatedBy': { '$in': user } };
      const user7792 = await deleteUser(userFilter5773);
      const userTokensFilter4577 = { 'userId': { '$in': user } };
      const userTokens3057 = await deleteUserTokens(userTokensFilter4577);
      const userRoleFilter7116 = { 'userId': { '$in': user } };
      const userRole7584 = await deleteUserRole(userRoleFilter7116);
      return await User.deleteMany(filter);
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    return await UserTokens.deleteMany(filter);
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter6043 = { 'roleId': { '$in': role } };
      const routeRole3250 = await deleteRouteRole(routeRoleFilter6043);
      const userRoleFilter0387 = { 'roleId': { '$in': role } };
      const userRole7735 = await deleteUserRole(userRoleFilter0387);
      return await Role.deleteMany(filter);
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter3738 = { 'routeId': { '$in': projectroute } };
      const routeRole4488 = await deleteRouteRole(routeRoleFilter3738);
      return await ProjectRoute.deleteMany(filter);
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.deleteMany(filter);
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.deleteMany(filter);
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter2895 = { 'addedBy': { '$in': user } };
      const user2861Cnt = await countUser(userFilter2895);
      const userFilter7818 = { 'updatedBy': { '$in': user } };
      const user5968Cnt = await countUser(userFilter7818);
      const userTokensFilter2684 = { 'userId': { '$in': user } };
      const userTokens7489Cnt = await countUserTokens(userTokensFilter2684);
      const userRoleFilter2746 = { 'userId': { '$in': user } };
      const userRole3638Cnt = await countUserRole(userRoleFilter2746);
      const userCnt =  await User.countDocuments(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user2861Cnt,
        ...user5968Cnt,
        ...userTokens7489Cnt,
        ...userRole3638Cnt,
      };
      return response;
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
    const userTokensCnt =  await UserTokens.countDocuments(filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter9913 = { 'roleId': { '$in': role } };
      const routeRole7421Cnt = await countRouteRole(routeRoleFilter9913);
      const userRoleFilter1636 = { 'roleId': { '$in': role } };
      const userRole1502Cnt = await countUserRole(userRoleFilter1636);
      const roleCnt =  await Role.countDocuments(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole7421Cnt,
        ...userRole1502Cnt,
      };
      return response;
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter8713 = { 'routeId': { '$in': projectroute } };
      const routeRole0256Cnt = await countRouteRole(routeRoleFilter8713);
      const projectRouteCnt =  await ProjectRoute.countDocuments(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole0256Cnt,
      };
      return response;
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.countDocuments(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.countDocuments(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,loggedInUser) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter8202 = { 'addedBy': { '$in': user } };
      const user8282 = await softDeleteUser(userFilter8202);
      const userFilter7552 = { 'updatedBy': { '$in': user } };
      const user6821 = await softDeleteUser(userFilter7552);
      const userTokensFilter6425 = { 'userId': { '$in': user } };
      const userTokens7373 = await softDeleteUserTokens(userTokensFilter6425);
      const userRoleFilter9858 = { 'userId': { '$in': user } };
      const userRole3462 = await softDeleteUserRole(userRoleFilter9858);
      if (loggedInUser && loggedInUser.id)
        return await User.updateMany(filter, {
          isDeleted:true,
          updatedBy:loggedInUser.id
        });
      else
        return await User.updateMany(filter,{ isDeleted:true });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,loggedInUser) =>{
  try {
    if (loggedInUser && loggedInUser.id)
      return await UserTokens.updateMany(filter, {
        isDeleted:true,
        updatedBy:loggedInUser.id
      });
    else
      return await UserTokens.updateMany(filter,{ isDeleted:true });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,loggedInUser) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter1689 = { 'roleId': { '$in': role } };
      const routeRole2965 = await softDeleteRouteRole(routeRoleFilter1689);
      const userRoleFilter4654 = { 'roleId': { '$in': role } };
      const userRole5575 = await softDeleteUserRole(userRoleFilter4654);
      if (loggedInUser && loggedInUser.id)
        return await Role.updateMany(filter, {
          isDeleted:true,
          updatedBy:loggedInUser.id
        });
      else
        return await Role.updateMany(filter,{ isDeleted:true });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,loggedInUser) =>{
  try {
    let projectroute = await ProjectRoute.find(filter, { _id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter5920 = { 'routeId': { '$in': projectroute } };
      const routeRole2859 = await softDeleteRouteRole(routeRoleFilter5920);
      if (loggedInUser && loggedInUser.id)
        return await ProjectRoute.updateMany(filter, {
          isDeleted:true,
          updatedBy:loggedInUser.id
        });
      else
        return await ProjectRoute.updateMany(filter,{ isDeleted:true });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,loggedInUser) =>{
  try {
    if (loggedInUser && loggedInUser.id)
      return await RouteRole.updateMany(filter, {
        isDeleted:true,
        updatedBy:loggedInUser.id
      });
    else
      return await RouteRole.updateMany(filter,{ isDeleted:true });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,loggedInUser) =>{
  try {
    if (loggedInUser && loggedInUser.id)
      return await UserRole.updateMany(filter, {
        isDeleted:true,
        updatedBy:loggedInUser.id
      });
    else
      return await UserRole.updateMany(filter,{ isDeleted:true });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
