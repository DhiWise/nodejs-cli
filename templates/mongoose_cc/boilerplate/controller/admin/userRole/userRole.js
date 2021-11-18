const message = require('../../../utils/messages');

function makeUserRoleController ({
  userRoleService,makeUserRole
})
{
  const addUserRole = async ({
    data, loggedInUser
  }) => {
    try {
      const originalData = data;
      originalData.addedBy = loggedInUser.id.toString();
      const userRole = makeUserRole(originalData,'insertUserRoleValidator');
      let createdUserRole = await userRoleService.createDocument(userRole);
            
      return message.successResponse(
        { data :  createdUserRole }
      );

    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertUserRole = async ({
    body, loggedInUser
  }) => {
    try {
      let data = body.data;
      data.map((item) => { 
        item.addedBy = loggedInUser.id.toString(); 
        return item; 
      });
      const userRoleEntities = data.map((item)=>makeUserRole(item,'insertUserRoleValidator'));
      const results = await userRoleService.bulkInsert(userRoleEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllUserRole = async ({
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
        result = await userRoleService.countDocument(query);
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
        result = await userRoleService.getAllDocuments(query,options);
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

  const getUserRoleById = async (query, body = {}) =>{
    try {
      if (query){
        let options = {};
        if (body && body.populate && body.populate.length) options.populate = body.populate;
        if (body && body.select && body.select.length) options.select = body.select;
        let result = await userRoleService.getSingleDocument(query, options);
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

  const partialUpdateUserRole = async (data,id, loggedInUser) => {
    try {
      if (id && data){
        delete data['addedBy'];
        delete data['updatedBy'];
        userRole.updatedBy = loggedInUser.id;
        const userRole = makeUserRole(data,'updateUserRoleValidator');            
        const filterData = removeEmpty(userRole);
        const query = { _id:id };
        let updatedUserRole = await userRoleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedUserRole){
          return message.successResponse({ data : updatedUserRole });
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

  const updateUserRole = async (data,id, loggedInUser) =>{
    try {
      delete data['addedBy'];
      delete data['updatedBy'];
      data.updatedBy = loggedInUser.id;
      if (id && data){
        const userRole = makeUserRole(data,'updateUserRoleValidator');
        const filterData = removeEmpty(userRole);
        let query = { _id:id };
        let updatedUserRole = await userRoleService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedUserRole){
          return message.successResponse({ data : updatedUserRole });
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

  const softDeleteUserRole = async (id,loggedInUser)=>{
    try {
      if (id){
        const query = { _id:id };
        let updatedUserRole = await userRoleService.softDeleteByQuery(query, loggedInUser);
        return message.successResponse({ data:updatedUserRole });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const getUserRoleByAggregate = async ({ data }) =>{
    try {
      if (data){
        let result = await userRoleService.getDocumentByAggregation(data);
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

  const getUserRoleCount = async (data) => {
    try {
      let where = {};
      if (data && data.where){
        where = data.where;
      }
      let result = await userRoleService.countDocument(where);
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

  const upsertUserRole = async (data, loggedInUser)=>{
    try {
      if (data){
        let result;
        if (data && data.id) {
          let where = data.id; 
          delete data['addedBy'];
          delete data['updatedBy'];
          data.updatedBy = loggedInUser.id;
          const userRole = makeUserRole(data,'updateUserRoleValidator');
          const filterData = removeEmpty(userRole);
          result = await userRoleService.updateDocument(where,filterData);
        }
        else {
          delete data['addedBy'];
          delete data['updatedBy'];
          data.addedBy = loggedInUser.id;
          const userRole = makeUserRole(data,'insertUserRoleValidator');

          result = await userRoleService.createDocument(userRole); 
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

  const bulkUpdateUserRole = async (data, loggedInUser) => {
    try {
      if (data.filter && data.data){
        delete data.data['addedBy'];
        delete data.data['updatedBy'];
        data.data.updatedBy = loggedInUser.id;
        const userRole = makeUserRole(data.data,'updateUserRoleValidator');
        const filterData = removeEmpty(userRole);
        let query = data.filter;
        const updatedUserRoles = await userRoleService.bulkUpdate(query,filterData);
        return message.successResponse({ data:updatedUserRoles });
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
    addUserRole,
    bulkInsertUserRole,
    findAllUserRole,
    getUserRoleById,
    partialUpdateUserRole,
    updateUserRole,
    softDeleteUserRole,
    getUserRoleByAggregate,
    getUserRoleCount,
    upsertUserRole,
    bulkUpdateUserRole,
    removeEmpty,
  });
}

module.exports = makeUserRoleController;
