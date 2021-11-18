const { Op } = require('sequelize');
const User = require('../../model/user');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const auth = require('../../services/auth');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');
const addUser = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    const data = ({
      ...req.body,
      addedBy:req.user.id
    });
    let result = await dbService.createOne(User,data);
    return  res.ok({ data :result });
  } catch (error) {
    return res.failureResponse(); 
  }
};

const findAllUser = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body.query !== undefined) {
      query = { ...req.body.query };
    }
    query = dbService.queryBuilderParser(query);
    if (req.user){
      query = {
        ...query,
        id: { [Op.ne]: req.user.id } 
      };
      if (req.body && req.body.query && req.body.query.id) {
        Object.assign(query.id, { [Op.in]: [req.body.query.id] });
      }
    }
    if (req.body && req.body.isCountOnly){
      result = await dbService.count(User, query);
      if (result) {
        result = { totalRecords: result };
        return res.ok({ data :result });
      } 
      return res.recordNotFound();
    }
    else {
      if (req.body && req.body.options !== undefined) {
        options = { ...req.body.options };
      }
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
      if (options && options.include && options.include.length){
        let include = [];
        options.include.forEach(i => {
          i.model = models[i.model];
          if (i.query) {
            i.where = dbService.queryBuilderParser(i.query);
          }
          include.push(i);
        });
        options.include = include;
      }
      if (options && options.sort){
        options.order = dbService.sortParser(options.sort);
        delete options.sort;
      }
      result = await dbService.findMany( User,query,options);
            
      if (!result){
        return res.recordNotFound();
      }
      return res.ok({ data:result });   
    }
  }
  catch (error){
    return res.failureResponse();
  }
};

const getUserCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(User,where);
    if (result){
      result = { totalRecords:result };
      return res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse();
  }
};

const softDeleteManyUser = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.in]: ids,
            [Op.ne]: req.user.id
          }
        };
      } 
      let result = await deleteDependentService.softDeleteUser(query,req.user.id);
      if (!result) {
        return res.recordNotFound();
      }
      return  res.ok({ data :result });
    }
    return res.badRequest();
  } catch (error){
    return res.failureResponse(); 
  }
};

const bulkInsertUser = async (req, res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;
      data = data.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        

      let result = await dbService.createMany(User,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.failureResponse();
  }
};

const bulkUpdateUser = async (req, res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = req.body.data;
      let result = await dbService.updateMany(User,filter,data);
      if (!result){
        return res.recordNotFound();
      }

      return  res.ok({ data :result });
    }
    else {
      return res.failureResponse();
    }
  }
  catch (error){
    return res.failureResponse(); 
  }
};

const deleteManyUser = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.ids){
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.in]: ids,
            [Op.ne]: req.user.id
          }
        };
      } 
      let result;
      if (data.isWarning){
        result = await deleteDependentService.countUser(query);
      }
      else {
        result = await deleteDependentService.deleteUser(query);
      }
      return res.ok({ data :result });
    }
    return res.badRequest(); 
  }
  catch (error){
    return res.failureResponse(); 
  }
};

const softDeleteUser = async (req, res) => {
  try {
    let possibleDependent = [
      {
        model: 'user',
        refId: 'addedBy',
        relType: 2,
        refAttribute: 'id' 
      },
      {
        model: 'user',
        refId: 'updatedBy',
        relType: 2,
        refAttribute: 'id' 
      },
      {
        model: 'userAuthSettings',
        refId: 'userId',
        relType: 2,
        refAttribute: 'id'
      },
      {
        model: 'userToken',
        refId: 'userId',
        relType: 2,
        refAttribute: 'id'
      },
      {
        model: 'userRole',
        refId: 'userId',
        relType: 2,
        refAttribute: 'id'
      }
    ];
    let id = req.params.id;
    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: id,
          [Op.ne]: req.user.id
        }
      };
    } 
        
    let result = await deleteDependentService.softDeleteUser(query,req.user.id);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data :result });
  } catch (error){
    return res.failureResponse(); 
  }
};

const partialUpdateUser = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return res.badRequest();
    } 
    let result = await dbService.updateMany(User, query, data);
    if (!result) {
      return res.recordNotFound();
    }
        
    return res.ok({ data :result });
        
  }
  catch (error){
    return res.failureResponse();
  }
};

const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.addedBy;
    delete data.updatedBy;
    data.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return res.badRequest();
    }
    let result = await dbService.updateMany(User,query,data);
    if (!result){
      return res.recordNotFound();
    }

    return  res.ok({ data :result });
  }
  catch (error){
    return res.failureResponse();
  }
};

const getUser = async (req, res) => {
  try {
    let query = {};
    const options = {};
    if (req.body && req.body.select && req.body.select.length) {
      options.attributes = req.body.select;
    }
    if (req.body && req.body.include && req.body.include.length) {
      let include = [];
      req.body.include.forEach(i => {
        i.model = models[i.model];
        if (i.query) {
          i.where = dbService.queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    let id = req.params.id;
    let result = await dbService.findByPk(User,id,options);
    if (result){
      return  res.ok({ data :result });
            
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse();
  }
};

const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
        
    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: id,
          [Op.ne]: req.user.id
        }
      };
    } 
    else {
      return res.badRequest();
    } 
    if (req.body.isWarning) {
      let result = await deleteDependentService.countUser(query);
      if (result){
        return res.ok({ data :result });
      }
      return res.recordNotFound();
    } else {
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.eq]: id,
            [Op.ne]: req.user.id
          }
        };
      } 
      else {
        return res.badRequest();
      } 
      let result = await deleteDependentService.deleteUser(query);
      if (!result){
        return res.failureResponse();
      }
      return  res.ok({ data :result });    
    }
  }
  catch (error){
    return res.failureResponse(); 
  }
};

const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!params.newPassword || !req.user.id || !params.oldPassword) {
      return res.inValidParam();
    }
    let result = await auth.changePassword({
      ...params,
      userId:req.user.id
    });
    if (result.flag){
      return res.invalidRequest({ message :result.data });
    }
    return res.requestValidated({ message :result.data });
  } catch (error) {
    return res.failureResponse();
  }
};
const updateProfile = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id:req.user.id
    };
    let validateRequest = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    if (data.password) delete data.password;
    if (data.createdAt) delete data.createdAt;
    if (data.updatedAt) delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateByPk(User, req.user.id ,data);
    if (!result){
      return res.recordNotFound();
    }            
    return  res.ok({ data :result });
  }
  catch (error){
    return res.failureResponse();
  }
};

module.exports = {
  addUser,
  findAllUser,
  getUserCount,
  softDeleteManyUser,
  bulkInsertUser,
  bulkUpdateUser,
  deleteManyUser,
  softDeleteUser,
  partialUpdateUser,
  updateUser,
  getUser,
  deleteUser,
  changePassword,
  updateProfile,
};
