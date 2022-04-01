/**
 * roleController.js
 * @description : exports action methods for role.
 */

const Role = require('../../model/role');
const roleSchemaKey = require('../../utils/validation/roleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Role in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Role. {status, message, data}
 */ 
const addRole = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      roleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Role(dataToCreate);
    let createdRole = await dbService.createDocument(Role,dataToCreate);
    return res.success({ data : createdRole });
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
 * @description : create multiple documents of Role in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Roles. {status, message, data}
 */
const bulkInsertRole = async (req,res)=>{
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
    let createdRoles = await dbService.bulkInsert(Role,dataToCreate);
    return res.success({ data :createdRoles });
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
 * @description : find all documents of Role from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Role(s). {status, message, data}
 */
const findAllRole = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      roleSchemaKey.findFilterKeys,
      Role.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(Role, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundRoles = await dbService.getAllDocuments( Role,query,options);
    if (!foundRoles || !foundRoles.data || !foundRoles.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundRoles });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Role.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getRoleCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      roleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedRole = await dbService.countDocument(Role,where);
    countedRole = { totalRecords: countedRole };
    return res.success({ data : countedRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Role with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Roles.
 * @return {Object} : updated Roles. {status, message, data}
 */
const bulkUpdateRole = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(Role,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Role from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Role.
 * @return {Object} : number of deactivated documents of Role. {status, message, data}
 */
const softDeleteManyRole = async (req,res) => {
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
    let updatedRole = await deleteDependentService.softDeleteRole(query, updateBody);
    if (!updatedRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Role in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedRole;
    if (req.body.isWarning) {
      deletedRole = await deleteDependentService.countRole(query);
    }
    else {
      deletedRole = await deleteDependentService.deleteRole(query);
    }
    if (!deletedRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of Role from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Role.
 * @return {Object} : deactivated Role. {status, message, data}
 */
const softDeleteRole = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedRole = await deleteDependentService.softDeleteRole(query, updateBody);
    if (!updatedRole){
      return res.recordNotFound();
    }
    return res.success({ data:updatedRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Role with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Role.
 * @return {obj} : updated Role. {status, message, data}
 */
const partialUpdateRole = async (req,res) => {
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
      roleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedRole = await dbService.findOneAndUpdateDocument(Role, query, dataToUpdate,{ new:true });
    if (!updatedRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Role with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Role.
 * @return {Object} : updated Role. {status, message, data}
 */
const updateRole = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      roleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedRole = await dbService.findOneAndUpdateDocument(Role,query,dataToUpdate,{ new:true });
    if (!updatedRole){
      return res.recordNotFound();
    }
    return res.success({ data :updatedRole });
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
 * @description : find document of Role from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Role. {status, message, data}
 */
const getRole = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundRole = await dbService.getSingleDocument(Role,query, options);
    if (!foundRole){
      return res.recordNotFound();
    }
    return res.success({ data :foundRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of Role from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Role. {status, message, data}
 */
const deleteRole = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedRole;
    if (req.body.isWarning) { 
      deletedRole = await deleteDependentService.countRole(query);
    } else {
      deletedRole = await deleteDependentService.deleteRole(query);
    }
    if (!deletedRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addRole,
  bulkInsertRole,
  findAllRole,
  getRoleCount,
  bulkUpdateRole,
  softDeleteManyRole,
  deleteManyRole,
  softDeleteRole,
  partialUpdateRole,
  updateRole,
  getRole,
  deleteRole,
};