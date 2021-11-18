
const { Op } = require('sequelize');
const deleteDependentService = require('../../../utils/deleteDependent');
const message = require('../../../utils/messages');
const models = require('../../../model');
function makeUserController ({
  userService,makeUser,authService
})
{
  const addUser = async ({
    data,loggedInUser
  }) => {
    try {
      const originalData = data;
      delete originalData.addedBy;
      delete originalData.updatedBy;
      originalData.addedBy = loggedInUser.id;
      const user = makeUser(originalData, 'insertUserValidator');
      let createdUser = await userService.createOne(user);
      return message.successResponse({ data:createdUser });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const findAllUser = async ({
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
      query = userService.queryBuilderParser(query);
      if (loggedInUser){
        query = {
          ...query,
          id: { [Op.ne]: loggedInUser.id }
        };
        if (data.query && data.query.id) {
          Object.assign(query.id, { [Op.in]: [data.query.id] });
        }
      } else {
        return message.badRequest();
      }
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.sort){
        options.order = userService.sortParser(options.sort);
        delete options.sort;
      }
      let result;
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = userService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }  
      if (data.isCountOnly){
        result = await userService.count(query, options);
        if (result) {
          result = { totalRecords: result };  
          return message.successResponse(result);
        } else {
          return message.recordNotFound();
        }
      } else {
        result = await userService.findMany(query, options);
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

  const softDeleteManyUser = async (ids,loggedInUser) => {
    try {
      if (ids){
        let query = {};
        if (loggedInUser){
          query = {
            id: {
              [Op.in]: ids,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        let data = await deleteDependentService.softDeleteUser(query,loggedInUser.id);
        return message.successResponse({ data:data });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkInsertUser = async ({
    body,loggedInUser
  })=>{
    try {
      let data = body.data;
      const userEntities = data.map((item)=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = loggedInUser.id;
        return makeUser(item,'insertUserValidator');
      });
      const results = await userService.createMany(userEntities);
      return message.successResponse({ data:results });
    } catch (error){
      if (error.name === 'ValidationError') {
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const bulkUpdateUser = async (data,loggedInUser) =>{
    try {
      if (data.filter && data.data){
        delete data.data.addedBy;
        delete data.data.updatedBy;
        data.data.updatedBy = loggedInUser.id;
        const user = makeUser(data.data,'updateUserValidator');
        const filterData = removeEmpty(user);
        const updatedUsers = await userService.updateMany(data.filter,filterData);
        return message.successResponse({ data:updatedUsers });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message: error.message });
      }
      return message.failureResponse();
    }
  };

  const deleteManyUser = async (data, loggedInUser) => {
    try {
      if (data && data.ids){
        let ids = data.ids;
        let query = {};
        if (loggedInUser){
          query = {
            id: {
              [Op.in]: ids,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        let result;
        if (data.isWarning){
          result = await deleteDependentService.countUser(query);
        }
        else {
          result = await deleteDependentService.deleteUser(query);
        }
        return message.successResponse({ data:result });
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

  const softDeleteUser = async ({
    pk,loggedInUser
  },options = {})=>{
    try {
      if (pk){
        let updatedUser;
        let query = {};
        if (loggedInUser){
          query = {
            id: {
              [Op.eq]: pk,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        updatedUser = await deleteDependentService.softDeleteUser(query,loggedInUser.id);            
        return message.successResponse({ data:updatedUser });
      }
      return message.badRequest();
    } catch (error){
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const partialUpdateUser = async (id,data,loggedInUser) =>{
    try {
      if (data && id){          
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            'id': {
              [Op.eq]: id,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        let updatedUser = await userService.updateMany(query,filterData);
        return message.successResponse({ data:updatedUser });
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

  const updateUser = async (pk, data,loggedInUser) =>{
    try {
      if (pk){          
        delete data.addedBy;
        delete data.updatedBy;
        data.updatedBy = loggedInUser.id;
        const user = makeUser(data,'updateUserValidator');
        const filterData = removeEmpty(user);
        let query = {};
        if (loggedInUser){
          query = {
            'id': {
              [Op.eq]: pk,
              [Op.ne]: loggedInUser.id
            }
          };
        } else {
          return message.badRequest();
        }
        let updatedUser = await userService.updateMany(query,filterData);
        return message.successResponse({ data:updatedUser });
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

  const findUserByPk = async (pk,body = {}) => {
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
      let result = await userService.findByPk(pk, options);
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

  const deleteUser = async (pk, body,loggedInUser,options = {})=>{
    try {
      if (!pk){
        return message.badRequest();
      }
      let query = {};
      if (loggedInUser){
        query = {
          'id': {
            [Op.eq]: pk,
            [Op.ne]: loggedInUser.id
          }
        };
      } else {
        return message.badRequest();
      }
      let deletedUser = '';
      if (isWarning){
        deletedUser = await deleteDependentService.countUser(query);
      } else {
        deletedUser = await deleteDependentService.deleteUser(query);
      }
      return message.successResponse({ data: deletedUser });
    } catch (error) {
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
      }
      return message.failureResponse();
    }
  };

  const changePassword = async (params) => {
    try {
      if (!params.newPassword || !params.userId || !params.oldPassword) { 
        return message.inValidParam({ message : 'Please Provide userId and Password' });
      }
      let result = await authService.changePassword(params);
      if (result.flag) {
        return message.invalidRequest({ message :result.data });
      }
      return message.requestValidated({ data :result.data });
    } catch (error) {
      if (error.name === 'ValidationError'){
        return message.inValidParam({ message : error.message });
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
        let updatedUser = await userService.updateByPk(id,filterData);
        return message.successResponse({ data:updatedUser });
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

  const removeEmpty = (obj) => {
    Object.entries(obj).forEach(([key,value])=>{
      if (value === undefined){
        delete obj[key];
      }
    });
    return obj;
  };

  return Object.freeze({
    addUser,
    findAllUser,
    softDeleteManyUser,
    bulkInsertUser,
    bulkUpdateUser,
    deleteManyUser,
    softDeleteUser,
    partialUpdateUser,
    updateUser,
    findUserByPk,
    deleteUser,
    changePassword,
    updateProfile
  });
}

module.exports = makeUserController;
