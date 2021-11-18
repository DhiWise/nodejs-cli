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
      const userFilter87250 = { 'addedBy': { [Op.in]: user } };
      const user88748 = await deleteUser(userFilter87250);
      const userFilter63494 = { 'updatedBy': { [Op.in]: user } };
      const user61374 = await deleteUser(userFilter63494);
      const userAuthSettingsFilter41341 = { 'userId': { [Op.in]: user } };
      const userAuthSettings59005 = await deleteUserAuthSettings(userAuthSettingsFilter41341);
      const userTokenFilter15959 = { 'userId': { [Op.in]: user } };
      const userToken29429 = await deleteUserToken(userTokenFilter15959);
      const userRoleFilter19800 = { 'userId': { [Op.in]: user } };
      const userRole89601 = await deleteUserRole(userRoleFilter19800);
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
      const routeRoleFilter35363 = { 'roleId': { [Op.in]: role } };
      const routeRole67821 = await deleteRouteRole(routeRoleFilter35363);
      const userRoleFilter18996 = { 'roleId': { [Op.in]: role } };
      const userRole68457 = await deleteUserRole(userRoleFilter18996);
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
      const routeRoleFilter83427 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole33485 = await deleteRouteRole(routeRoleFilter83427);
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
      const userFilter40605 = { 'addedBy': { [Op.in]: user } };
      const user50688Cnt = await countUser(userFilter40605);
      const userFilter65361 = { 'updatedBy': { [Op.in]: user } };
      const user67335Cnt = await countUser(userFilter65361);
      const userAuthSettingsFilter16473 = { 'userId': { [Op.in]: user } };
      const userAuthSettings97865Cnt = await countUserAuthSettings(userAuthSettingsFilter16473);
      const userTokenFilter67889 = { 'userId': { [Op.in]: user } };
      const userToken08178Cnt = await countUserToken(userTokenFilter67889);
      const userRoleFilter27768 = { 'userId': { [Op.in]: user } };
      const userRole99577Cnt = await countUserRole(userRoleFilter27768);
      const userCnt =  await User.count({ where:filter });
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user50688Cnt,
        ...user67335Cnt,
        ...userAuthSettings97865Cnt,
        ...userToken08178Cnt,
        ...userRole99577Cnt,
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
      const routeRoleFilter58057 = { 'roleId': { [Op.in]: role } };
      const routeRole21851Cnt = await countRouteRole(routeRoleFilter58057);
      const userRoleFilter12781 = { 'roleId': { [Op.in]: role } };
      const userRole67647Cnt = await countUserRole(userRoleFilter12781);
      const roleCnt =  await Role.count({ where:filter });
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole21851Cnt,
        ...userRole67647Cnt,
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
      const routeRoleFilter63460 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole91632Cnt = await countRouteRole(routeRoleFilter63460);
      const projectRouteCnt =  await ProjectRoute.count({ where:filter });
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole91632Cnt,
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
      const userFilter88417 = { 'addedBy': { [Op.in]: user } };
      const user58873 = await softDeleteUser(userFilter88417,loggedInUserId);
      const userFilter29541 = { 'updatedBy': { [Op.in]: user } };
      const user63804 = await softDeleteUser(userFilter29541,loggedInUserId);
      const userAuthSettingsFilter58292 = { 'userId': { [Op.in]: user } };
      const userAuthSettings47645 = await softDeleteUserAuthSettings(userAuthSettingsFilter58292,loggedInUserId);
      const userTokenFilter23374 = { 'userId': { [Op.in]: user } };
      const userToken50012 = await softDeleteUserToken(userTokenFilter23374,loggedInUserId);
      const userRoleFilter79621 = { 'userId': { [Op.in]: user } };
      const userRole19533 = await softDeleteUserRole(userRoleFilter79621,loggedInUserId);
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
      const routeRoleFilter63257 = { 'roleId': { [Op.in]: role } };
      const routeRole30273 = await softDeleteRouteRole(routeRoleFilter63257,loggedInUserId);
      const userRoleFilter53531 = { 'roleId': { [Op.in]: role } };
      const userRole65916 = await softDeleteUserRole(userRoleFilter53531,loggedInUserId);
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
      const routeRoleFilter69705 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole82330 = await softDeleteRouteRole(routeRoleFilter69705,loggedInUserId);
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
