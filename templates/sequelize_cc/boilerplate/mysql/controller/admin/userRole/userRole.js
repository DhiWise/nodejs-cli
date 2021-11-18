
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const models = require('../../../model');
function makeUserRoleController ({
  userRoleService,makeUserRole
})
{
  const addUserRole = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const userRole = makeUserRole(originalData, 'insertUserRoleValidator');
      let createdUserRole = await userRoleService.createOne(userRole);
      return message.successResponse({ data:createdUserRole });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertUserRole = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const userRoleEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeUserRole(item,'insertUserRoleValidator');
      });
      const results = await userRoleService.createMany(userRoleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllUserRole = async ({
    data,loggedInUser
  }) => {
    try {
      let query = {};
      let options = {};
      if (data.query !== undefined){
        query = { ...data.query };
      }
      if (data.options !== undefined){
        options = { ...data.options };
      }
      query = userRoleService.queryBuilderParser(query);
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.sort){
        options.order = userRoleService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = userRoleService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await userRoleService.count(query, options);
        if (result) {
          result = { totalRecords: result };  
          return message.successResponse(result);
        } else {
          return message.recordNotFound();
        }
      } else {
        result = await userRoleService.findMany(query, options);
      }
      if (result){
        return message.successResponse({ data:result });
      } else {
        return message.badRequest();
      }
              
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findUserRoleByPk = async (pk,body = {}) => {
    try {
      let options = {};
      if (body && body.select && body.select.length) {
        options.attributes = body.select;
      }
      if (body && body.include && body.include.length) {
        let include = [];
        body.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = dbService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }
      let result = await userRoleService.findByPk(pk, options);
      if (result){
        return message.successResponse({ data:result });
      } else {
        return message.recordNotFound();
      }
            
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const partialUpdateUserRole = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const userRole = makeUserRole(data,'updateUserRoleValidator');
        const filterData = removeEmpty(userRole);
        let query = { id:id };
        let updatedUserRole = await userRoleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedUserRole });
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const updateUserRole = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const userRole = makeUserRole(data,'updateUserRoleValidator');
        const filterData = removeEmpty(userRole);
        let query = { id:pk };
        let updatedUserRole = await userRoleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedUserRole });
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const softDeleteUserRole = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedUserRole;
        let query = { id:pk };
        updatedUserRole = await userRoleService.softDeleteMany(query, options,loggedInUser.id);
        return message.successResponse({ data:updatedUserRole });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const upsertUserRole = async (data)=>{
    try {
      if (data){
        let result = await userRoleService.upsert(data);
        if (result){
          return message.successResponse();
        }
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };
  const bulkUpdateUserRole = async (data,loggedInUser) =>{
    try {
      if (data.filter && data.data){
        delete data.data.addedBy;
        delete data.data.updatedBy;
        data.data.updatedBy = loggedInUser.id;
        const userRole = makeUserRole(data.data,'updateUserRoleValidator');
        const filterData = removeEmpty(userRole);
        const updatedUserRoles = await userRoleService.updateMany(data.filter,filterData);
        return message.successResponse({ data:updatedUserRoles });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const removeEmpty = (obj) => {
    Object.entries(obj).forEach(([key,value])=>{
      if (value === undefined){
        delete obj[key];
      }
    });
    return obj;
  };

  return Object.freeze({
    addUserRole,
    bulkInsertUserRole,
    findAllUserRole,
    findUserRoleByPk,
    partialUpdateUserRole,
    updateUserRole,
    softDeleteUserRole,
    upsertUserRole,
    bulkUpdateUserRole
  });
}

module.exports = makeUserRoleController;
