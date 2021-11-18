const message = require('../../../utils/messages');

function makeRouteRoleController ({
  routeRoleService,makeRouteRole
})
{
  const addRouteRole = async ({
    data, loggedInUser
  }) => {
    try {
      const originalData = data;
      originalData.addedBy = loggedInUser.id.toString();
      const routeRole = makeRouteRole(originalData,'insertRouteRoleValidator');
      let createdRouteRole = await routeRoleService.createDocument(routeRole);
            
      return message.successResponse(
        { data :  createdRouteRole }
      );

    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertRouteRole = async ({
    body, loggedInUser
  }) => {
    try {
      let data = body.data;
      data.map((item) => { 
        item.addedBy = loggedInUser.id.toString(); 
        return item; 
      });
      const routeRoleEntities = data.map((item)=>makeRouteRole(item,'insertRouteRoleValidator'));
      const results = await routeRoleService.bulkInsert(routeRoleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllRouteRole = async ({
    data, loggedInUser
  }) => {
    try {
      let options = {};
      let query = {};
      let result;
      if (data.query !== undefined) {
        query = { ...data.query };
      }
      if (data.isCountOnly){
        result = await routeRoleService.countDocument(query);
        if (result) {
          result = { totalRecords: result };  
          return message.successResponse(result);
        } else {
          return message.recordNotFound();
        }
      } else { 
        if (data.options !== undefined) {
          options = { ...data.options };
        }
        result = await routeRoleService.getAllDocuments(query,options);
      }
      if (result.data){
        return message.successResponse({ data: result });
      } else {
        return message.recordNotFound();
      }
            
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const getRouteRoleById = async (query, body = {}) =>{
    try {
      if (query){
        let options = {};
        if (body && body.populate && body.populate.length) options.populate = body.populate;
        if (body && body.select && body.select.length) options.select = body.select;
        let result = await routeRoleService.getSingleDocument(query, options);
        if (result){
          return message.successResponse({ data: result });
        }
        return message.recordNotFound();
                 
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const partialUpdateRouteRole = async (data,id, loggedInUser) => {
    try {
      if (id && data){
        delete data['addedBy'];
        delete data['updatedBy'];
        routeRole.updatedBy = loggedInUser.id;
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');            
        const filterData = removeEmpty(routeRole);
        const query = { _id:id };
        let updatedRouteRole = await routeRoleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedRouteRole){
          return message.successResponse({ data : updatedRouteRole });
        }
        else {
          return message.badRequest();
        }
      }
      else {
        return message.badRequest();
      }
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const updateRouteRole = async (data,id, loggedInUser) =>{
    try {
      delete data['addedBy'];
      delete data['updatedBy'];
      data.updatedBy = loggedInUser.id;
      if (id && data){
        const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = { _id:id };
        let updatedRouteRole = await routeRoleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedRouteRole){
          return message.successResponse({ data : updatedRouteRole });
        }
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

  const softDeleteRouteRole = async (id,loggedInUser)=>{
    try {
      if (id){
        const query = { _id:id };
        let updatedRouteRole = await routeRoleService.softDeleteByQuery(query, loggedInUser);
        return message.successResponse({ data:updatedRouteRole });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const getRouteRoleByAggregate = async ({ data }) =>{
    try {
      if (data){
        let result = await routeRoleService.getDocumentByAggregation(data);
        if (result && result.length){
          return message.successResponse({ data: result });
        }
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse(); 
    }
  };

  const getRouteRoleCount = async (data) => {
    try {
      let where = {};
      if (data && data.where){
        where = data.where;
      }
      let result = await routeRoleService.countDocument(where);
      if (result){
        result = { totalRecords:result };
        return message.successResponse({ data: result });
                
      }
      else {
        return message.recordNotFound();
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const upsertRouteRole = async (data, loggedInUser)=>{
    try {
      if (data){
        let result;
        if (data && data.id) {
          let where = data.id; 
          delete data['addedBy'];
          delete data['updatedBy'];
          data.updatedBy = loggedInUser.id;
          const routeRole = makeRouteRole(data,'updateRouteRoleValidator');
          const filterData = removeEmpty(routeRole);
          result = await routeRoleService.updateDocument(where,filterData);
        }
        else {
          delete data['addedBy'];
          delete data['updatedBy'];
          data.addedBy = loggedInUser.id;
          const routeRole = makeRouteRole(data,'insertRouteRoleValidator');

          result = await routeRoleService.createDocument(routeRole); 
        }
        return message.successResponse({ data:result });
                
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkUpdateRouteRole = async (data, loggedInUser) => {
    try {
      if (data.filter && data.data){
        delete data.data['addedBy'];
        delete data.data['updatedBy'];
        data.data.updatedBy = loggedInUser.id;
        const routeRole = makeRouteRole(data.data,'updateRouteRoleValidator');
        const filterData = removeEmpty(routeRole);
        let query = data.filter;
        const updatedRouteRoles = await routeRoleService.bulkUpdate(query,filterData);
        return message.successResponse({ data:updatedRouteRoles });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
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
    getRouteRoleById,
    partialUpdateRouteRole,
    updateRouteRole,
    softDeleteRouteRole,
    getRouteRoleByAggregate,
    getRouteRoleCount,
    upsertRouteRole,
    bulkUpdateRouteRole,
    removeEmpty,
  });
}

module.exports = makeRouteRoleController;
