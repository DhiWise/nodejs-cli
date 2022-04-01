/**
 * userRoleController.js
 * @description : exports action methods for userRole.
 */

const UserRole = require('../../model/userRole');
const userRoleSchemaKey = require('../../utils/validation/userRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of UserRole in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created UserRole. {status, message, data}
 */ 
const addUserRole = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      userRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new UserRole(dataToCreate);
    let createdUserRole = await dbService.createDocument(UserRole,dataToCreate);
    return res.success({ data : createdUserRole });
  } catch (error) {
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of UserRole in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created UserRoles. {status, message, data}
 */
const bulkInsertUserRole = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdUserRoles = await dbService.bulkInsert(UserRole,dataToCreate);
    return res.success({ data :createdUserRoles });
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of UserRole from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found UserRole(s). {status, message, data}
 */
const findAllUserRole = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userRoleSchemaKey.findFilterKeys,
      UserRole.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(UserRole, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundUserRoles = await dbService.getAllDocuments( UserRole,query,options);
    if (!foundUserRoles || !foundUserRoles.data || !foundUserRoles.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundUserRoles });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of UserRole.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getUserRoleCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      userRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedUserRole = await dbService.countDocument(UserRole,where);
    countedUserRole = { totalRecords: countedUserRole };
    return res.success({ data : countedUserRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of UserRole with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated UserRoles.
 * @return {Object} : updated UserRoles. {status, message, data}
 */
const bulkUpdateUserRole = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = { ...req.body.data };
    delete dataToUpdate['addedBy'];
    if (typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...dataToUpdate,
        updatedBy : req.user.id
      };
    }
    let result = await dbService.bulkUpdate(UserRole,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of UserRole from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of UserRole.
 * @return {Object} : number of deactivated documents of UserRole. {status, message, data}
 */
const softDeleteManyUserRole = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedUserRole = await dbService.bulkUpdate(UserRole,query, updateBody);
    if (!updatedUserRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedUserRole });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of UserRole in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyUserRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedUserRole = await dbService.deleteMany(UserRole,query);
    if (!deletedUserRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedUserRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of UserRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of UserRole.
 * @return {Object} : deactivated UserRole. {status, message, data}
 */
const softDeleteUserRole = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedUserRole = await dbService.findOneAndUpdateDocument(UserRole, query, updateBody,{ new:true });
    if (!updatedUserRole){
      return res.recordNotFound();
    }
    return res.success({ data:updatedUserRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of UserRole with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated UserRole.
 * @return {obj} : updated UserRole. {status, message, data}
 */
const partialUpdateUserRole = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest();
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedUserRole = await dbService.findOneAndUpdateDocument(UserRole, query, dataToUpdate,{ new:true });
    if (!updatedUserRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedUserRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of UserRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated UserRole.
 * @return {Object} : updated UserRole. {status, message, data}
 */
const updateUserRole = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedUserRole = await dbService.findOneAndUpdateDocument(UserRole,query,dataToUpdate,{ new:true });
    if (!updatedUserRole){
      return res.recordNotFound();
    }
    return res.success({ data :updatedUserRole });
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code === 11000){
      return res.validationError({ message : 'Data duplication found.' });
    }
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of UserRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found UserRole. {status, message, data}
 */
const getUserRole = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundUserRole = await dbService.getSingleDocument(UserRole,query, options);
    if (!foundUserRole){
      return res.recordNotFound();
    }
    return res.success({ data :foundUserRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of UserRole from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted UserRole. {status, message, data}
 */
const deleteUserRole = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedUserRole = await dbService.findOneAndDeleteDocument(UserRole, query);
    if (!deletedUserRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedUserRole });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
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