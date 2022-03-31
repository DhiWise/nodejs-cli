/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

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

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(User,filter);
      return response;

    } else {
      return 'No user found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserAuthSettings,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserToken,filter);
    return response;
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

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(Role,filter);
      return response;

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

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      let response  = await dbService.deleteMany(ProjectRoute,filter);
      return response;

    } else {
      return 'No projectRoute found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
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

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userAuthSettingsCnt =  await dbService.count(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userTokenCnt =  await dbService.count(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        user : userCnt,
        userAuthSettings : userAuthSettingsCnt,
        userToken : userTokenCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
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

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
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

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
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

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const userFilter9471 = { 'addedBy': { [Op.in]: user } };
      const user6599 = await softDeleteUser(userFilter9471,updateBody);
      const userFilter4408 = { 'updatedBy': { [Op.in]: user } };
      const user5685 = await softDeleteUser(userFilter4408,updateBody);
      const userAuthSettingsFilter3770 = { 'userId': { [Op.in]: user } };
      const userAuthSettings6464 = await softDeleteUserAuthSettings(userAuthSettingsFilter3770,updateBody);
      const userAuthSettingsFilter1273 = { 'addedBy': { [Op.in]: user } };
      const userAuthSettings0840 = await softDeleteUserAuthSettings(userAuthSettingsFilter1273,updateBody);
      const userAuthSettingsFilter5565 = { 'updatedBy': { [Op.in]: user } };
      const userAuthSettings4405 = await softDeleteUserAuthSettings(userAuthSettingsFilter5565,updateBody);
      const userTokenFilter0172 = { 'userId': { [Op.in]: user } };
      const userToken7419 = await softDeleteUserToken(userTokenFilter0172,updateBody);
      const userTokenFilter2249 = { 'addedBy': { [Op.in]: user } };
      const userToken9806 = await softDeleteUserToken(userTokenFilter2249,updateBody);
      const userTokenFilter2240 = { 'updatedBy': { [Op.in]: user } };
      const userToken4553 = await softDeleteUserToken(userTokenFilter2240,updateBody);
      const userRoleFilter2754 = { 'userId': { [Op.in]: user } };
      const userRole6012 = await softDeleteUserRole(userRoleFilter2754,updateBody);
      return await User.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserAuthSettings.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserToken.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter0318 = { 'roleId': { [Op.in]: role } };
      const routeRole7581 = await softDeleteRouteRole(routeRoleFilter0318,updateBody);
      const userRoleFilter8885 = { 'roleId': { [Op.in]: role } };
      const userRole6857 = await softDeleteUserRole(userRoleFilter8885,updateBody);
      return await Role.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter3392 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole4559 = await softDeleteRouteRole(routeRoleFilter3392,updateBody);
      return await ProjectRoute.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
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
