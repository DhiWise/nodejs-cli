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
      const userFilter6084 = { 'addedBy': { [Op.in]: user } };
      const user6132 = await deleteUser(userFilter6084);
      const userFilter3262 = { 'updatedBy': { [Op.in]: user } };
      const user8657 = await deleteUser(userFilter3262);
      const userAuthSettingsFilter8883 = { 'userId': { [Op.in]: user } };
      const userAuthSettings5316 = await deleteUserAuthSettings(userAuthSettingsFilter8883);
      const userTokenFilter9494 = { 'userId': { [Op.in]: user } };
      const userToken4290 = await deleteUserToken(userTokenFilter9494);
      const userRoleFilter9422 = { 'userId': { [Op.in]: user } };
      const userRole9880 = await deleteUserRole(userRoleFilter9422);
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
      const routeRoleFilter9729 = { 'roleId': { [Op.in]: role } };
      const routeRole1606 = await deleteRouteRole(routeRoleFilter9729);
      const userRoleFilter3945 = { 'roleId': { [Op.in]: role } };
      const userRole1654 = await deleteUserRole(userRoleFilter3945);
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
      const routeRoleFilter0617 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9728 = await deleteRouteRole(routeRoleFilter0617);
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
      const userFilter5364 = { 'addedBy': { [Op.in]: user } };
      const user5569Cnt = await countUser(userFilter5364);
      const userFilter8352 = { 'updatedBy': { [Op.in]: user } };
      const user9231Cnt = await countUser(userFilter8352);
      const userAuthSettingsFilter5345 = { 'userId': { [Op.in]: user } };
      const userAuthSettings5519Cnt = await countUserAuthSettings(userAuthSettingsFilter5345);
      const userTokenFilter7336 = { 'userId': { [Op.in]: user } };
      const userToken5189Cnt = await countUserToken(userTokenFilter7336);
      const userRoleFilter6124 = { 'userId': { [Op.in]: user } };
      const userRole8560Cnt = await countUserRole(userRoleFilter6124);
      const userCnt =  await User.count(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user5569Cnt,
        ...user9231Cnt,
        ...userAuthSettings5519Cnt,
        ...userToken5189Cnt,
        ...userRole8560Cnt,
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
      const routeRoleFilter4916 = { 'roleId': { [Op.in]: role } };
      const routeRole8363Cnt = await countRouteRole(routeRoleFilter4916);
      const userRoleFilter2255 = { 'roleId': { [Op.in]: role } };
      const userRole0425Cnt = await countUserRole(userRoleFilter2255);
      const roleCnt =  await Role.count(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole8363Cnt,
        ...userRole0425Cnt,
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
      const routeRoleFilter2751 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9354Cnt = await countRouteRole(routeRoleFilter2751);
      const projectRouteCnt =  await ProjectRoute.count(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole9354Cnt,
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
      const userFilter0758 = { 'addedBy': { [Op.in]: user } };
      const user0891 = await softDeleteUser(userFilter0758,loggedInUserId);
      const userFilter7776 = { 'updatedBy': { [Op.in]: user } };
      const user5200 = await softDeleteUser(userFilter7776,loggedInUserId);
      const userAuthSettingsFilter6451 = { 'userId': { [Op.in]: user } };
      const userAuthSettings1673 = await softDeleteUserAuthSettings(userAuthSettingsFilter6451,loggedInUserId);
      const userTokenFilter0438 = { 'userId': { [Op.in]: user } };
      const userToken7903 = await softDeleteUserToken(userTokenFilter0438,loggedInUserId);
      const userRoleFilter7967 = { 'userId': { [Op.in]: user } };
      const userRole3176 = await softDeleteUserRole(userRoleFilter7967,loggedInUserId);
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
      const routeRoleFilter3732 = { 'roleId': { [Op.in]: role } };
      const routeRole0699 = await softDeleteRouteRole(routeRoleFilter3732,loggedInUserId);
      const userRoleFilter9838 = { 'roleId': { [Op.in]: role } };
      const userRole8585 = await softDeleteUserRole(userRoleFilter9838,loggedInUserId);
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
      const routeRoleFilter8320 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole7992 = await softDeleteRouteRole(routeRoleFilter8320,loggedInUserId);
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
