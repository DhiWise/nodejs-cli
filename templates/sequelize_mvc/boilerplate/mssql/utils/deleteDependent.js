let User = require('../model/user');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');
const { Op } = require('sequelize');

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const userFilter6528 = { 'addedBy': { [Op.in]: user } };
      const user2418 = await deleteUser(userFilter6528);
      const userFilter5854 = { 'updatedBy': { [Op.in]: user } };
      const user8390 = await deleteUser(userFilter5854);
      const userAuthSettingsFilter9378 = { 'userId': { [Op.in]: user } };
      const userAuthSettings6907 = await deleteUserAuthSettings(userAuthSettingsFilter9378);
      const userTokenFilter4715 = { 'userId': { [Op.in]: user } };
      const userToken3298 = await deleteUserToken(userTokenFilter4715);
      const userRoleFilter4436 = { 'userId': { [Op.in]: user } };
      const userRole3890 = await deleteUserRole(userRoleFilter4436);
      return await User.destroy({ where :filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    return await UserToken.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter5768 = { 'roleId': { [Op.in]: role } };
      const routeRole6926 = await deleteRouteRole(routeRoleFilter5768);
      const userRoleFilter7262 = { 'roleId': { [Op.in]: role } };
      const userRole3647 = await deleteUserRole(userRoleFilter7262);
      return await Role.destroy({ where :filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter8197 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole3335 = await deleteRouteRole(routeRoleFilter8197);
      return await ProjectRoute.destroy({ where :filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const userFilter1162 = { 'addedBy': { [Op.in]: user } };
      const user1897Cnt = await countUser(userFilter1162);
      const userFilter1487 = { 'updatedBy': { [Op.in]: user } };
      const user7825Cnt = await countUser(userFilter1487);
      const userAuthSettingsFilter6659 = { 'userId': { [Op.in]: user } };
      const userAuthSettings5904Cnt = await countUserAuthSettings(userAuthSettingsFilter6659);
      const userTokenFilter3112 = { 'userId': { [Op.in]: user } };
      const userToken1433Cnt = await countUserToken(userTokenFilter3112);
      const userRoleFilter7878 = { 'userId': { [Op.in]: user } };
      const userRole0516Cnt = await countUserRole(userRoleFilter7878);
      const userCnt =  await User.count(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user1897Cnt,
        ...user7825Cnt,
        ...userAuthSettings5904Cnt,
        ...userToken1433Cnt,
        ...userRole0516Cnt,
      };
      return response;
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter9732 = { 'roleId': { [Op.in]: role } };
      const routeRole9428Cnt = await countRouteRole(routeRoleFilter9732);
      const userRoleFilter7282 = { 'roleId': { [Op.in]: role } };
      const userRole3318Cnt = await countUserRole(userRoleFilter7282);
      const roleCnt =  await Role.count(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole9428Cnt,
        ...userRole3318Cnt,
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
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter2934 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole4752Cnt = await countRouteRole(routeRoleFilter2934);
      const projectRouteCnt =  await ProjectRoute.count(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole4752Cnt,
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
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,loggedInUserId) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const userFilter5407 = { 'addedBy': { [Op.in]: user } };
      const user3379 = await softDeleteUser(userFilter5407,loggedInUserId);
      const userFilter6796 = { 'updatedBy': { [Op.in]: user } };
      const user4398 = await softDeleteUser(userFilter6796,loggedInUserId);
      const userAuthSettingsFilter5323 = { 'userId': { [Op.in]: user } };
      const userAuthSettings5254 = await softDeleteUserAuthSettings(userAuthSettingsFilter5323,loggedInUserId);
      const userTokenFilter1263 = { 'userId': { [Op.in]: user } };
      const userToken0041 = await softDeleteUserToken(userTokenFilter1263,loggedInUserId);
      const userRoleFilter5531 = { 'userId': { [Op.in]: user } };
      const userRole5642 = await softDeleteUserRole(userRoleFilter5531,loggedInUserId);
      if (loggedInUserId){
        return await User.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await User.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter ,
          });
      }
 
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,loggedInUserId) =>{
  try {
    if (loggedInUserId){
      return await UserAuthSettings.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserAuthSettings.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
        
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,loggedInUserId) =>{
  try {
    if (loggedInUserId){
      return await UserToken.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserToken.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
        
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,loggedInUserId) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter7330 = { 'roleId': { [Op.in]: role } };
      const routeRole2220 = await softDeleteRouteRole(routeRoleFilter7330,loggedInUserId);
      const userRoleFilter8098 = { 'roleId': { [Op.in]: role } };
      const userRole2164 = await softDeleteUserRole(userRoleFilter8098,loggedInUserId);
      if (loggedInUserId){
        return await Role.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await Role.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter ,
          });
      }
 
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,loggedInUserId) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter3052 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9559 = await softDeleteRouteRole(routeRoleFilter3052,loggedInUserId);
      if (loggedInUserId){
        return await ProjectRoute.update(
          {
            isDeleted:true,
            updatedBy:loggedInUserId
          },{
            fields: ['isDeleted','updatedBy'],
            where: filter ,
          });
      } else {
        return await ProjectRoute.update(
          { isDeleted:true },{
            fields: ['isDeleted'],
            where: filter ,
          });
      }
 
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,loggedInUserId) =>{
  try {
    if (loggedInUserId){
      return await RouteRole.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await RouteRole.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
        
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,loggedInUserId) =>{
  try {
    if (loggedInUserId){
      return await UserRole.update(
        {
          isDeleted:true,
          updatedBy:loggedInUserId
        },{
          fields: ['isDeleted','updatedBy'],
          where: filter ,
        });
    } else {
      return await UserRole.update(
        { isDeleted:true },{
          fields: ['isDeleted'],
          where: filter,
        });
    }
        
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
