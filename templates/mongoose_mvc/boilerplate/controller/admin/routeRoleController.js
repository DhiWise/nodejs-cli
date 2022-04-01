/**
 * routeRoleController.js
 * @description : exports action methods for routeRole.
 */

const RouteRole = require('../../model/routeRole');
const routeRoleSchemaKey = require('../../utils/validation/routeRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of RouteRole in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created RouteRole. {status, message, data}
 */ 
const addRouteRole = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      routeRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new RouteRole(dataToCreate);
    let createdRouteRole = await dbService.createDocument(RouteRole,dataToCreate);
    return res.success({ data : createdRouteRole });
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
 * @description : create multiple documents of RouteRole in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created RouteRoles. {status, message, data}
 */
const bulkInsertRouteRole = async (req,res)=>{
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
    let createdRouteRoles = await dbService.bulkInsert(RouteRole,dataToCreate);
    return res.success({ data :createdRouteRoles });
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
 * @description : find all documents of RouteRole from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found RouteRole(s). {status, message, data}
 */
const findAllRouteRole = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      routeRoleSchemaKey.findFilterKeys,
      RouteRole.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(RouteRole, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundRouteRoles = await dbService.getAllDocuments( RouteRole,query,options);
    if (!foundRouteRoles || !foundRouteRoles.data || !foundRouteRoles.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundRouteRoles });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of RouteRole.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getRouteRoleCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      routeRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedRouteRole = await dbService.countDocument(RouteRole,where);
    countedRouteRole = { totalRecords: countedRouteRole };
    return res.success({ data : countedRouteRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of RouteRole with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated RouteRoles.
 * @return {Object} : updated RouteRoles. {status, message, data}
 */
const bulkUpdateRouteRole = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(RouteRole,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of RouteRole from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of RouteRole.
 * @return {Object} : number of deactivated documents of RouteRole. {status, message, data}
 */
const softDeleteManyRouteRole = async (req,res) => {
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
    let updatedRouteRole = await dbService.bulkUpdate(RouteRole,query, updateBody);
    if (!updatedRouteRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedRouteRole });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of RouteRole in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyRouteRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedRouteRole = await dbService.deleteMany(RouteRole,query);
    if (!deletedRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedRouteRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate document of RouteRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of RouteRole.
 * @return {Object} : deactivated RouteRole. {status, message, data}
 */
const softDeleteRouteRole = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedRouteRole = await dbService.findOneAndUpdateDocument(RouteRole, query, updateBody,{ new:true });
    if (!updatedRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data:updatedRouteRole });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of RouteRole with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated RouteRole.
 * @return {obj} : updated RouteRole. {status, message, data}
 */
const partialUpdateRouteRole = async (req,res) => {
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
      routeRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedRouteRole = await dbService.findOneAndUpdateDocument(RouteRole, query, dataToUpdate,{ new:true });
    if (!updatedRouteRole) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedRouteRole });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of RouteRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated RouteRole.
 * @return {Object} : updated RouteRole. {status, message, data}
 */
const updateRouteRole = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      routeRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedRouteRole = await dbService.findOneAndUpdateDocument(RouteRole,query,dataToUpdate,{ new:true });
    if (!updatedRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data :updatedRouteRole });
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
 * @description : find document of RouteRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found RouteRole. {status, message, data}
 */
const getRouteRole = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundRouteRole = await dbService.getSingleDocument(RouteRole,query, options);
    if (!foundRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data :foundRouteRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : delete document of RouteRole from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted RouteRole. {status, message, data}
 */
const deleteRouteRole = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const deletedRouteRole = await dbService.findOneAndDeleteDocument(RouteRole, query);
    if (!deletedRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data :deletedRouteRole });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  addRouteRole,
  bulkInsertRouteRole,
  findAllRouteRole,
  getRouteRoleCount,
  bulkUpdateRouteRole,
  softDeleteManyRouteRole,
  deleteManyRouteRole,
  softDeleteRouteRole,
  partialUpdateRouteRole,
  updateRouteRole,
  getRouteRole,
  deleteRouteRole,
};