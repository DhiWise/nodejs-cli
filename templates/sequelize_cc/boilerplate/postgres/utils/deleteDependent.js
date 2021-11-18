let User = require('../model').user;
let UserAuthSettings = require('../model').userAuthSettings;
let UserToken = require('../model').userToken;
let Role = require('../model').role;
let ProjectRoute = require('../model').projectRoute;
let RouteRole = require('../model').routeRole;
let UserRole = require('../model').userRole;
const { Op } = require('sequelize');

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });        
    if (user && user.length){    
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userFilter88403 = { 'addedBy': { [Op.in]: user } };
      const user82998 = await deleteUser(userFilter88403);
      const userFilter22390 = { 'updatedBy': { [Op.in]: user } };
      const user27977 = await deleteUser(userFilter22390);
      const userAuthSettingsFilter85473 = { 'userId': { [Op.in]: user } };
      const userAuthSettings30580 = await deleteUserAuthSettings(userAuthSettingsFilter85473);
      const userTokenFilter94465 = { 'userId': { [Op.in]: user } };
      const userToken77253 = await deleteUserToken(userTokenFilter94465);
      const userRoleFilter32173 = { 'userId': { [Op.in]: user } };
      const userRole26158 = await deleteUserRole(userRoleFilter32173);
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
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter98686 = { 'roleId': { [Op.in]: role } };
      const routeRole58596 = await deleteRouteRole(routeRoleFilter98686);
      const userRoleFilter28212 = { 'roleId': { [Op.in]: role } };
      const userRole85155 = await deleteUserRole(userRoleFilter28212);
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
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter88691 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole12317 = await deleteRouteRole(routeRoleFilter88691);
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
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userFilter44126 = { 'addedBy': { [Op.in]: user } };
      const user62386Cnt = await countUser(userFilter44126);
      const userFilter21970 = { 'updatedBy': { [Op.in]: user } };
      const user14990Cnt = await countUser(userFilter21970);
      const userAuthSettingsFilter86547 = { 'userId': { [Op.in]: user } };
      const userAuthSettings50822Cnt = await countUserAuthSettings(userAuthSettingsFilter86547);
      const userTokenFilter59668 = { 'userId': { [Op.in]: user } };
      const userToken06048Cnt = await countUserToken(userTokenFilter59668);
      const userRoleFilter95733 = { 'userId': { [Op.in]: user } };
      const userRole77513Cnt = await countUserRole(userRoleFilter95733);
      const userCnt =  await User.count({ where:filter });
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user62386Cnt,
        ...user14990Cnt,
        ...userAuthSettings50822Cnt,
        ...userToken06048Cnt,
        ...userRole77513Cnt,
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
    const userAuthSettingsCnt =  await UserAuthSettings.count({ where:filter });
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count({ where:filter });
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
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter88650 = { 'roleId': { [Op.in]: role } };
      const routeRole72064Cnt = await countRouteRole(routeRoleFilter88650);
      const userRoleFilter60807 = { 'roleId': { [Op.in]: role } };
      const userRole06826Cnt = await countUserRole(userRoleFilter60807);
      const roleCnt =  await Role.count({ where:filter });
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole72064Cnt,
        ...userRole06826Cnt,
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
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter18268 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole71786Cnt = await countRouteRole(routeRoleFilter18268);
      const projectRouteCnt =  await ProjectRoute.count({ where:filter });
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole71786Cnt,
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
    const routeRoleCnt =  await RouteRole.count({ where:filter });
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count({ where:filter });
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
      user = user.map(x=>x.dataValues);
      user = user.map((obj) => obj.id);
      const userFilter53964 = { 'addedBy': { [Op.in]: user } };
      const user47422 = await softDeleteUser(userFilter53964,loggedInUserId);
      const userFilter55136 = { 'updatedBy': { [Op.in]: user } };
      const user16733 = await softDeleteUser(userFilter55136,loggedInUserId);
      const userAuthSettingsFilter02956 = { 'userId': { [Op.in]: user } };
      const userAuthSettings03858 = await softDeleteUserAuthSettings(userAuthSettingsFilter02956,loggedInUserId);
      const userTokenFilter08312 = { 'userId': { [Op.in]: user } };
      const userToken99429 = await softDeleteUserToken(userTokenFilter08312,loggedInUserId);
      const userRoleFilter32716 = { 'userId': { [Op.in]: user } };
      const userRole83583 = await softDeleteUserRole(userRoleFilter32716,loggedInUserId);
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
            where: filter,
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
      role = role.map(x=>x.dataValues);
      role = role.map((obj) => obj.id);
      const routeRoleFilter49894 = { 'roleId': { [Op.in]: role } };
      const routeRole98230 = await softDeleteRouteRole(routeRoleFilter49894,loggedInUserId);
      const userRoleFilter85662 = { 'roleId': { [Op.in]: role } };
      const userRole87293 = await softDeleteUserRole(userRoleFilter85662,loggedInUserId);
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
            where: filter,
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
      projectroute = projectroute.map(x=>x.dataValues);
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter13725 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole14742 = await softDeleteRouteRole(routeRoleFilter13725,loggedInUserId);
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
            where: filter,
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
