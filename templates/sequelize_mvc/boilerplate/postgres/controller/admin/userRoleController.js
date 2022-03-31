/**
 * userRoleController.js
 * @description :: exports action methods for userRole.
 */

const { Op } = require('sequelize');
const UserRole = require('../../model/userRole');
const userRoleSchemaKey = require('../../utils/validation/userRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of UserRole in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created UserRole. {status, message, data}
 */ 
const addUserRole = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      userRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdUserRole = await dbService.createOne(UserRole,dataToCreate);
    return  res.success({ data :createdUserRole });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of UserRole in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created UserRoles. {status, message, data}
 */
const bulkInsertUserRole = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdUserRole = await dbService.createMany(UserRole,dataToCreate);
      return  res.success({ data :createdUserRole });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find all records of UserRole from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found UserRole(s). {status, message, data}
 */
const findAllUserRole = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundUserRole;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      userRoleSchemaKey.findFilterKeys,
      UserRole.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundUserRole = await dbService.count(UserRole, query);
      if (!foundUserRole) {
        return res.recordNotFound();
      } 
      foundUserRole = { totalRecords: foundUserRole };
      return res.success({ data :foundUserRole });
    }
    if (dataToFind && dataToFind.options !== undefined) {
      options = dataToFind.options;
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
    foundUserRole = await dbService.findMany( UserRole,query,options);
            
    if (!foundUserRole){
      return res.recordNotFound();
    }
    return res.success({ data:foundUserRole });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of UserRole.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getUserRoleCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      userRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedUserRole = await dbService.count(UserRole,where);
    if (!countedUserRole){
      return res.recordNotFound();
    }
    countedUserRole = { totalRecords:countedUserRole };
    return res.success({ data :countedUserRole });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of UserRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated UserRoles.
 * @return {Object} : updated UserRoles. {status, message, data}
 */
const bulkUpdateUserRole = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedUserRole = await dbService.updateMany(UserRole,filter,dataToUpdate);
    if (!updatedUserRole){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedUserRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate multiple records of UserRole from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of UserRole.
 * @return {Object} : number of deactivated documents of UserRole. {status, message, data}
 */
const softDeleteManyUserRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(UserRole,query,updateBody, options);
      if (!result) {
        return res.recordNotFound();
      }
      return  res.success({ data :result });
    }
    return res.badRequest();
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of UserRole in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyUserRole = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedUserRole = await dbService.deleteMany(UserRole,query);
    return res.success({ data :deletedUserRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of UserRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of UserRole.
 * @return {Object} : deactivated UserRole. {status, message, data}
 */
const softDeleteUserRole = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(UserRole, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of UserRole with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated UserRole.
 * @return {Object} : updated UserRole. {status, message, data}
 */
const partialUpdateUserRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedUserRole = await dbService.updateMany(UserRole, query, dataToUpdate);
    if (!updatedUserRole) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedUserRole });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of UserRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated UserRole.
 * @return {Object} : updated UserRole. {status, message, data}
 */
const updateUserRole = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }          
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userRoleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedUserRole = await dbService.updateMany(UserRole,query,dataToUpdate);

    return  res.success({ data :updatedUserRole });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of UserRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found UserRole. {status, message, data}
 */
const getUserRole = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundUserRole = await dbService.findByPk(UserRole,id,options);
    if (!foundUserRole){
      return res.recordNotFound();
    }
    return  res.success({ data :foundUserRole });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of UserRole from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted UserRole. {status, message, data}
 */
const deleteUserRole = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(UserRole, req.params.id);
    if (result){
      return  res.success({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

module.exports = {
  addUserRole,
  bulkInsertUserRole,
  findAllUserRole,
  getUserRoleCount,
  bulkUpdateUserRole,
  softDeleteManyUserRole,
  deleteManyUserRole,
  softDeleteUserRole,
  partialUpdateUserRole,
  updateUserRole,
  getUserRole,
  deleteUserRole,
};
