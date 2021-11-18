
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const models = require('../../../model');
function makeRoleController ({
  roleService,makeRole
})
{
  const addRole = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const role = makeRole(originalData, 'insertRoleValidator');
      let createdRole = await roleService.createOne(role);
      return message.successResponse({ data:createdRole });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertRole = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const roleEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeRole(item,'insertRoleValidator');
      });
      const results = await roleService.createMany(roleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllRole = async ({
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
      query = roleService.queryBuilderParser(query);
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.sort){
        options.order = roleService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = roleService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await roleService.count(query, options);
        if (result) {
          result = { totalRecords: result };  
          return message.successResponse(result);
        } else {
          return message.recordNotFound();
        }
      } else {
        result = await roleService.findMany(query, options);
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

  const findRoleByPk = async (pk,body = {}) => {
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
      let result = await roleService.findByPk(pk, options);
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

  const partialUpdateRole = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const role = makeRole(data,'updateRoleValidator');
        const filterData = removeEmpty(role);
        let query = { id:id };
        let updatedRole = await roleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedRole });
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

  const softDeleteRole = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedRole;
        let query = { id:pk };
        updatedRole = await deleteDependentService.softDeleteRole(query,loggedInUser.id);            
        return message.successResponse({ data:updatedRole });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const updateRole = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const role = makeRole(data,'updateRoleValidator');
        const filterData = removeEmpty(role);
        let query = { id:pk };
        let updatedRole = await roleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedRole });
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

  const upsertRole = async (data)=>{
    try {
      if (data){
        let result = await roleService.upsert(data);
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
  const bulkUpdateRole = async (data,loggedInUser) =>{
    try {
      if (data.filter && data.data){
        delete data.data.addedBy;
        delete data.data.updatedBy;
        data.data.updatedBy = loggedInUser.id;
        const role = makeRole(data.data,'updateRoleValidator');
        const filterData = removeEmpty(role);
        const updatedRoles = await roleService.updateMany(data.filter,filterData);
        return message.successResponse({ data:updatedRoles });
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
    addRole,
    bulkInsertRole,
    findAllRole,
    findRoleByPk,
    partialUpdateRole,
    softDeleteRole,
    updateRole,
    upsertRole,
    bulkUpdateRole
  });
}

module.exports = makeRoleController;
