
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const models = require('../../../model');
function makeRouteRoleController ({
  routeRoleService,makeRouteRole
})
{
  const addRouteRole = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const routeRole = makeRouteRole(originalData, 'insertRouteRoleValidator');
      let createdRouteRole = await routeRoleService.createOne(routeRole);
      return message.successResponse({ data:createdRouteRole });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertRouteRole = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const routeRoleEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeRouteRole(item,'insertRouteRoleValidator');
      });
      const results = await routeRoleService.createMany(routeRoleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllRouteRole = async ({
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
      query = routeRoleService.queryBuilderParser(query);
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.sort){
        options.order = routeRoleService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = routeRoleService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await routeRoleService.count(query, options);
        if (result) {
          result = { totalRecords: result };  
          return message.successResponse(result);
        } else {
          return message.recordNotFound();
        }
      } else {
        result = await routeRoleService.findMany(query, options);
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

  const findRouteRoleByPk = async (pk,body = {}) => {
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
      let result = await routeRoleService.findByPk(pk, options);
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

  const partialUpdateRouteRole = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = { id:id };
        let updatedRouteRole = await routeRoleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedRouteRole });
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

  const updateRouteRole = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = { id:pk };
        let updatedRouteRole = await routeRoleService.updateMany(query,filterData);
        return message.successResponse({ data:updatedRouteRole });
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

  const softDeleteRouteRole = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedRouteRole;
        let query = { id:pk };
        updatedRouteRole = await routeRoleService.softDeleteMany(query, options,loggedInUser.id);
        return message.successResponse({ data:updatedRouteRole });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const upsertRouteRole = async (data)=>{
    try {
      if (data){
        let result = await routeRoleService.upsert(data);
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
  const bulkUpdateRouteRole = async (data,loggedInUser) =>{
    try {
      if (data.filter && data.data){
        delete data.data.addedBy;
        delete data.data.updatedBy;
        data.data.updatedBy = loggedInUser.id;
        const routeRole = makeRouteRole(data.data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        const updatedRouteRoles = await routeRoleService.updateMany(data.filter,filterData);
        return message.successResponse({ data:updatedRouteRoles });
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
    addRouteRole,
    bulkInsertRouteRole,
    findAllRouteRole,
    findRouteRoleByPk,
    partialUpdateRouteRole,
    updateRouteRole,
    softDeleteRouteRole,
    upsertRouteRole,
    bulkUpdateRouteRole
  });
}

module.exports = makeRouteRoleController;
