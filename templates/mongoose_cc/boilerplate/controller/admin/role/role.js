const message = require('../../../utils/messages');

function makeRoleController ({
  roleService,makeRole
})
{
  const addRole = async ({
    data, loggedInUser
  }) => {
    try {
      const originalData = data;
      originalData.addedBy = loggedInUser.id.toString();
      const role = makeRole(originalData,'insertRoleValidator');
      let createdRole = await roleService.createDocument(role);
            
      return message.successResponse(
        { data :  createdRole }
      );

    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertRole = async ({
    body, loggedInUser
  }) => {
    try {
      let data = body.data;
      data.map((item) => { 
        item.addedBy = loggedInUser.id.toString(); 
        return item; 
      });
      const roleEntities = data.map((item)=>makeRole(item,'insertRoleValidator'));
      const results = await roleService.bulkInsert(roleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllRole = async ({
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
        result = await roleService.countDocument(query);
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
        result = await roleService.getAllDocuments(query,options);
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

  const getRoleById = async (query, body = {}) =>{
    try {
      if (query){
        let options = {};
        if (body && body.populate && body.populate.length) options.populate = body.populate;
        if (body && body.select && body.select.length) options.select = body.select;
        let result = await roleService.getSingleDocument(query, options);
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

  const partialUpdateRole = async (data,id, loggedInUser) => {
    try {
      if (id && data){
        delete data['addedBy'];
        delete data['updatedBy'];
        role.updatedBy = loggedInUser.id;
        const role = makeRole(data,'updateRoleValidator');            
        const filterData = removeEmpty(role);
        const query = { _id:id };
        let updatedRole = await roleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedRole){
          return message.successResponse({ data : updatedRole });
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

  const softDeleteRole = async (id,loggedInUser) => {
    try {
      const deleteDependentService = require('../../../utils/deleteDependent');
      const query = { _id:id };
      let result = await deleteDependentService.softDeleteRole(query, loggedInUser);
      return message.successResponse({ data:result });
            
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const updateRole = async (data,id, loggedInUser) =>{
    try {
      delete data['addedBy'];
      delete data['updatedBy'];
      data.updatedBy = loggedInUser.id;
      if (id && data){
        const role = makeRole(data,'updateRoleValidator');
        const filterData = removeEmpty(role);
        let query = { _id:id };
        let updatedRole = await roleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedRole){
          return message.successResponse({ data : updatedRole });
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

  const getRoleByAggregate = async ({ data }) =>{
    try {
      if (data){
        let result = await roleService.getDocumentByAggregation(data);
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

  const getRoleCount = async (data) => {
    try {
      let where = {};
      if (data && data.where){
        where = data.where;
      }
      let result = await roleService.countDocument(where);
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

  const upsertRole = async (data, loggedInUser)=>{
    try {
      if (data){
        let result;
        if (data && data.id) {
          let where = data.id; 
          delete data['addedBy'];
          delete data['updatedBy'];
          data.updatedBy = loggedInUser.id;
          const role = makeRole(data,'updateRoleValidator');
          const filterData = removeEmpty(role);
          result = await roleService.updateDocument(where,filterData);
        }
        else {
          delete data['addedBy'];
          delete data['updatedBy'];
          data.addedBy = loggedInUser.id;
          const role = makeRole(data,'insertRoleValidator');

          result = await roleService.createDocument(role); 
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

  const bulkUpdateRole = async (data, loggedInUser) => {
    try {
      if (data.filter && data.data){
        delete data.data['addedBy'];
        delete data.data['updatedBy'];
        data.data.updatedBy = loggedInUser.id;
        const role = makeRole(data.data,'updateRoleValidator');
        const filterData = removeEmpty(role);
        let query = data.filter;
        const updatedRoles = await roleService.bulkUpdate(query,filterData);
        return message.successResponse({ data:updatedRoles });
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
    addRole,
    bulkInsertRole,
    findAllRole,
    getRoleById,
    partialUpdateRole,
    softDeleteRole,
    updateRole,
    getRoleByAggregate,
    getRoleCount,
    upsertRole,
    bulkUpdateRole,
    removeEmpty,
  });
}

module.exports = makeRoleController;
