const message = require('../../../utils/messages');

function makeUserController ({
  userService,makeUser,authService
})
{
  const addUser = async ({
    data, loggedInUser
  }) => {
    try {
      const originalData = data;
      originalData.addedBy = loggedInUser.id.toString();
      const user = makeUser(originalData,'insertUserValidator');
      let createdUser = await userService.createDocument(user);
            
      return message.successResponse(
        { data :  createdUser }
      );

    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllUser = async ({
    data, loggedInUser
  }) => {
    try {
      let options = {};
      let query = {};
      let result;
      if (data.query !== undefined) {
        query = { ...data.query };
      }
      if (loggedInUser){
        query = {
          ...query,
          ...{ '_id': { $ne: loggedInUser.id } } 
        };
        if (data.query && data.query._id) {
          Object.assign(query._id, { $in: [data.query._id] });
        }
      } else {
        return message.badRequest();
      }
      if (data.isCountOnly){
        result = await userService.countDocument(query);
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
        result = await userService.getAllDocuments(query,options);
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

  const getUserCount = async (data) => {
    try {
      let where = {};
      if (data && data.where){
        where = data.where;
      }
      let result = await userService.countDocument(where);
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

  const getUserByAggregate = async ({ data }) =>{
    try {
      if (data){
        let result = await userService.getDocumentByAggregation(data);
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

  const softDeleteManyUser = async (ids, loggedInUser) => {
    try {
      if (ids){
        const deleteDependentService = require('../../../utils/deleteDependent');
        let query = {};
        if (loggedInUser){
          query = {
            '_id': {
              '$in': ids,
              '$ne': loggedInUser.id
            }
          };
        } 
        let result = await deleteDependentService.softDeleteUser(query, loggedInUser);
        return message.successResponse({ data:result });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertUser = async ({
    body, loggedInUser
  }) => {
    try {
      let data = body.data;
      data.map((item) => { 
        item.addedBy = loggedInUser.id.toString(); 
        return item; 
      });
      const userEntities = data.map((item)=>makeUser(item,'insertUserValidator'));
      const results = await userService.bulkInsert(userEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkUpdateUser = async (data, loggedInUser) => {
    try {
      if (data.filter && data.data){
        delete data.data['addedBy'];
        delete data.data['updatedBy'];
        data.data.updatedBy = loggedInUser.id;
        const user = makeUser(data.data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            '_id': {
              '$eq': id,
              '$ne': loggedInUser.id
            },
            ...data.filter                        
          };
        } else {
          return message.badRequest();
        }
        const updatedUsers = await userService.bulkUpdate(query,filterData);
        return message.successResponse({ data:updatedUsers });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };

  const deleteManyUser = async (data, loggedInUser) => {
    try {
      if (data && data.ids){
        const deleteDependentService = require('../../../utils/deleteDependent');
        let ids = data.ids;
        let query = {};
        if (loggedInUser){
          query = {
            '_id': {
              '$in': ids,
              '$ne': loggedInUser.id
            }
          };
        } 
        let result;
        if (data.isWarning){
          result = await deleteDependentService.countUser(query);
        } else {
          result = await deleteDependentService.deleteUser(query);
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

  const softDeleteUser = async (id,loggedInUser) => {
    try {
      const deleteDependentService = require('../../../utils/deleteDependent');
      let query = {};
      if (loggedInUser){
        query = {
          '_id': {
            '$eq': id,
            '$ne': loggedInUser.id
          }
        };
      } else {
        return message.badRequest();
      }
      let result = await deleteDependentService.softDeleteUser(query, loggedInUser);
      return message.successResponse({ data:result });
            
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const partialUpdateUser = async (data,id, loggedInUser) => {
    try {
      if (id && data){
        delete data['addedBy'];
        delete data['updatedBy'];
        user.updatedBy = loggedInUser.id;
        const user = makeUser(data,'updateUserValidator');            
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            '_id': {
              '$eq': id,
              '$ne': loggedInUser.id
            }
          }; 
          let updatedUser = await userService.findOneAndUpdateDocument(query,filterData,{ new:true });
          if (updatedUser){
            return message.successResponse({ data: updatedUser });
          }
          else {
            return message.badRequest();
          }
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

  const updateUser = async (data,id, loggedInUser) =>{
    try {
      delete data['addedBy'];
      delete data['updatedBy'];
      data.updatedBy = loggedInUser.id;
      if (id && data){
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            '_id': {
              '$eq': id,
              '$ne': loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        let updatedUser = await userService.findOneAndUpdateDocument(query,filterData,{ new:true });
        if (updatedUser){
          return message.successResponse({ data : updatedUser });
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

  const getUserById = async (query, body = {}) =>{
    try {
      if (query){
        let options = {};
        if (body && body.populate && body.populate.length) options.populate = body.populate;
        if (body && body.select && body.select.length) options.select = body.select;
        let result = await userService.getSingleDocument(query, options);
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

  const deleteUser = async (data,id,loggedInUser) => {
    try {
      let possibleDependent = [
        {
          model: 'user',
          refId: 'addedBy' 
        },
        {
          model: 'user',
          refId: 'updatedBy' 
        },
        {
          model: 'userTokens',
          refId: 'userId' 
        },
        {
          model: 'userRole',
          refId: 'userId' 
        }
      ];
      const deleteDependentService = require('../../../utils/deleteDependent');
      let query = {};
      if (loggedInUser){
        query = {
          '_id': {
            '$eq': id,
            '$ne': loggedInUser.id
          }
        };
      } else {
        return message.badRequest();
      }
      if (data.isWarning) {
        let all = await deleteDependentService.countUser(query);
        return message.successResponse({ data:all });
      } else {
        let result = await deleteDependentService.deleteUser(query);
        if (result){
          return message.successResponse({ data:result });
                    
        }
      }
      return message.badRequest();
    }
    catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message:error.message });
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

  const changePassword = async (params) => {
    try {
      if (!params.newPassword || !params.userId || !params.oldPassword) {
        return message.inValidParam({ message:'Please Provide userId and new Password and Old password' });
      }
      let result = await authService.changePassword(params);
      if (result.flag) {
        return message.invalidRequest({ message :result.data });
      }
      return message.requestValidated({ message :result.data });
            
    } catch (error) {
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message :error.message });
      }
      return message.failureResponse();
    }
  };  
    
  const updateProfile = async (data,id) =>{
    try {
      if (id && data){
        if (data.password) delete data.password;
        if (data.createdAt) delete data.createdAt;
        if (data.updatedAt) delete data.updatedAt;
        if (data.id) delete data.id;
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let updatedUser = await userService.findOneAndUpdateDocument({ _id:id },filterData,{ new:true });
        return message.successResponse({ data:updatedUser });
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

  return Object.freeze({
    addUser,
    findAllUser,
    getUserCount,
    getUserByAggregate,
    softDeleteManyUser,
    bulkInsertUser,
    bulkUpdateUser,
    deleteManyUser,
    softDeleteUser,
    partialUpdateUser,
    updateUser,
    getUserById,
    deleteUser,
    removeEmpty,
    changePassword,
    updateProfile,
  });
}

module.exports = makeUserController;
