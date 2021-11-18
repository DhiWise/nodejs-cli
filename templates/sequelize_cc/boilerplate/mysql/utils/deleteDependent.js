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
      const userFilter08202 = { 'addedBy': { [Op.in]: user } };
      const user86387 = await deleteUser(userFilter08202);
      const userFilter42215 = { 'updatedBy': { [Op.in]: user } };
      const user83349 = await deleteUser(userFilter42215);
      const userAuthSettingsFilter99739 = { 'userId': { [Op.in]: user } };
      const userAuthSettings81002 = await deleteUserAuthSettings(userAuthSettingsFilter99739);
      const userTokenFilter35031 = { 'userId': { [Op.in]: user } };
      const userToken34639 = await deleteUserToken(userTokenFilter35031);
      const userRoleFilter41854 = { 'userId': { [Op.in]: user } };
      const userRole22704 = await deleteUserRole(userRoleFilter41854);
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
      const routeRoleFilter86555 = { 'roleId': { [Op.in]: role } };
      const routeRole52462 = await deleteRouteRole(routeRoleFilter86555);
      const userRoleFilter20938 = { 'roleId': { [Op.in]: role } };
      const userRole78433 = await deleteUserRole(userRoleFilter20938);
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
      const routeRoleFilter21336 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole44592 = await deleteRouteRole(routeRoleFilter21336);
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
      const userFilter81543 = { 'addedBy': { [Op.in]: user } };
      const user49084Cnt = await countUser(userFilter81543);
      const userFilter09957 = { 'updatedBy': { [Op.in]: user } };
      const user73491Cnt = await countUser(userFilter09957);
      const userAuthSettingsFilter04389 = { 'userId': { [Op.in]: user } };
      const userAuthSettings53627Cnt = await countUserAuthSettings(userAuthSettingsFilter04389);
      const userTokenFilter78654 = { 'userId': { [Op.in]: user } };
      const userToken46233Cnt = await countUserToken(userTokenFilter78654);
      const userRoleFilter88906 = { 'userId': { [Op.in]: user } };
      const userRole61783Cnt = await countUserRole(userRoleFilter88906);
      const userCnt =  await User.count({ where:filter });
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user49084Cnt,
        ...user73491Cnt,
        ...userAuthSettings53627Cnt,
        ...userToken46233Cnt,
        ...userRole61783Cnt,
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
      const routeRoleFilter52592 = { 'roleId': { [Op.in]: role } };
      const routeRole69435Cnt = await countRouteRole(routeRoleFilter52592);
      const userRoleFilter22429 = { 'roleId': { [Op.in]: role } };
      const userRole23314Cnt = await countUserRole(userRoleFilter22429);
      const roleCnt =  await Role.count({ where:filter });
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole69435Cnt,
        ...userRole23314Cnt,
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
      const routeRoleFilter41481 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole95992Cnt = await countRouteRole(routeRoleFilter41481);
      const projectRouteCnt =  await ProjectRoute.count({ where:filter });
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole95992Cnt,
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
      const userFilter96131 = { 'addedBy': { [Op.in]: user } };
      const user15022 = await softDeleteUser(userFilter96131,loggedInUserId);
      const userFilter67202 = { 'updatedBy': { [Op.in]: user } };
      const user33839 = await softDeleteUser(userFilter67202,loggedInUserId);
      const userAuthSettingsFilter83706 = { 'userId': { [Op.in]: user } };
      const userAuthSettings65599 = await softDeleteUserAuthSettings(userAuthSettingsFilter83706,loggedInUserId);
      const userTokenFilter36141 = { 'userId': { [Op.in]: user } };
      const userToken00181 = await softDeleteUserToken(userTokenFilter36141,loggedInUserId);
      const userRoleFilter09821 = { 'userId': { [Op.in]: user } };
      const userRole04819 = await softDeleteUserRole(userRoleFilter09821,loggedInUserId);
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
      const routeRoleFilter57733 = { 'roleId': { [Op.in]: role } };
      const routeRole97481 = await softDeleteRouteRole(routeRoleFilter57733,loggedInUserId);
      const userRoleFilter92867 = { 'roleId': { [Op.in]: role } };
      const userRole76186 = await softDeleteUserRole(userRoleFilter92867,loggedInUserId);
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
      const routeRoleFilter43614 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole16142 = await softDeleteRouteRole(routeRoleFilter43614,loggedInUserId);
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
