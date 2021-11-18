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
      const userFilter4315 = { 'addedBy': { [Op.in]: user } };
      const user3564 = await deleteUser(userFilter4315);
      const userFilter5264 = { 'updatedBy': { [Op.in]: user } };
      const user6648 = await deleteUser(userFilter5264);
      const userAuthSettingsFilter4946 = { 'userId': { [Op.in]: user } };
      const userAuthSettings3781 = await deleteUserAuthSettings(userAuthSettingsFilter4946);
      const userTokenFilter4196 = { 'userId': { [Op.in]: user } };
      const userToken4224 = await deleteUserToken(userTokenFilter4196);
      const userRoleFilter0272 = { 'userId': { [Op.in]: user } };
      const userRole6286 = await deleteUserRole(userRoleFilter0272);
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
      const routeRoleFilter2595 = { 'roleId': { [Op.in]: role } };
      const routeRole0524 = await deleteRouteRole(routeRoleFilter2595);
      const userRoleFilter7380 = { 'roleId': { [Op.in]: role } };
      const userRole5189 = await deleteUserRole(userRoleFilter7380);
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
      const routeRoleFilter5196 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9428 = await deleteRouteRole(routeRoleFilter5196);
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
      const userFilter6737 = { 'addedBy': { [Op.in]: user } };
      const user2822Cnt = await countUser(userFilter6737);
      const userFilter6757 = { 'updatedBy': { [Op.in]: user } };
      const user4615Cnt = await countUser(userFilter6757);
      const userAuthSettingsFilter5464 = { 'userId': { [Op.in]: user } };
      const userAuthSettings2235Cnt = await countUserAuthSettings(userAuthSettingsFilter5464);
      const userTokenFilter7793 = { 'userId': { [Op.in]: user } };
      const userToken1966Cnt = await countUserToken(userTokenFilter7793);
      const userRoleFilter9879 = { 'userId': { [Op.in]: user } };
      const userRole9850Cnt = await countUserRole(userRoleFilter9879);
      const userCnt =  await User.count(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user2822Cnt,
        ...user4615Cnt,
        ...userAuthSettings2235Cnt,
        ...userToken1966Cnt,
        ...userRole9850Cnt,
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
      const routeRoleFilter0915 = { 'roleId': { [Op.in]: role } };
      const routeRole8035Cnt = await countRouteRole(routeRoleFilter0915);
      const userRoleFilter5762 = { 'roleId': { [Op.in]: role } };
      const userRole0799Cnt = await countUserRole(userRoleFilter5762);
      const roleCnt =  await Role.count(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole8035Cnt,
        ...userRole0799Cnt,
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
      const routeRoleFilter4979 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole2173Cnt = await countRouteRole(routeRoleFilter4979);
      const projectRouteCnt =  await ProjectRoute.count(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole2173Cnt,
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
      const userFilter4914 = { 'addedBy': { [Op.in]: user } };
      const user9674 = await softDeleteUser(userFilter4914,loggedInUserId);
      const userFilter5551 = { 'updatedBy': { [Op.in]: user } };
      const user0997 = await softDeleteUser(userFilter5551,loggedInUserId);
      const userAuthSettingsFilter9526 = { 'userId': { [Op.in]: user } };
      const userAuthSettings8245 = await softDeleteUserAuthSettings(userAuthSettingsFilter9526,loggedInUserId);
      const userTokenFilter4952 = { 'userId': { [Op.in]: user } };
      const userToken2957 = await softDeleteUserToken(userTokenFilter4952,loggedInUserId);
      const userRoleFilter7315 = { 'userId': { [Op.in]: user } };
      const userRole1498 = await softDeleteUserRole(userRoleFilter7315,loggedInUserId);
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
      const routeRoleFilter1304 = { 'roleId': { [Op.in]: role } };
      const routeRole7166 = await softDeleteRouteRole(routeRoleFilter1304,loggedInUserId);
      const userRoleFilter7486 = { 'roleId': { [Op.in]: role } };
      const userRole1433 = await softDeleteUserRole(userRoleFilter7486,loggedInUserId);
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
      const routeRoleFilter8974 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole9436 = await softDeleteRouteRole(routeRoleFilter8974,loggedInUserId);
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
