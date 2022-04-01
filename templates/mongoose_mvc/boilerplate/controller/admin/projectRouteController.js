/**
 * projectRouteController.js
 * @description : exports action methods for projectRoute.
 */

const ProjectRoute = require('../../model/projectRoute');
const projectRouteSchemaKey = require('../../utils/validation/projectRouteValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of ProjectRoute in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created ProjectRoute. {status, message, data}
 */ 
const addProjectRoute = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      projectRouteSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new ProjectRoute(dataToCreate);
    let createdProjectRoute = await dbService.createDocument(ProjectRoute,dataToCreate);
    return res.success({ data : createdProjectRoute });
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
 * @description : create multiple documents of ProjectRoute in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created ProjectRoutes. {status, message, data}
 */
const bulkInsertProjectRoute = async (req,res)=>{
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
    let createdProjectRoutes = await dbService.bulkInsert(ProjectRoute,dataToCreate);
    return res.success({ data :createdProjectRoutes });
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
 * @description : find all documents of ProjectRoute from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found ProjectRoute(s). {status, message, data}
 */
const findAllProjectRoute = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      projectRouteSchemaKey.findFilterKeys,
      ProjectRoute.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.countDocument(ProjectRoute, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundProjectRoutes = await dbService.getAllDocuments( ProjectRoute,query,options);
    if (!foundProjectRoutes || !foundProjectRoutes.data || !foundProjectRoutes.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundProjectRoutes });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of ProjectRoute.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getProjectRouteCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      projectRouteSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedProjectRoute = await dbService.countDocument(ProjectRoute,where);
    countedProjectRoute = { totalRecords: countedProjectRoute };
    return res.success({ data : countedProjectRoute });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of ProjectRoute with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated ProjectRoutes.
 * @return {Object} : updated ProjectRoutes. {status, message, data}
 */
const bulkUpdateProjectRoute = async (req,res)=>{
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
    let result = await dbService.bulkUpdate(ProjectRoute,filter,dataToUpdate);
    if (!result){
      return res.recordNotFound();
    }
    return res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of ProjectRoute from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of ProjectRoute.
 * @return {Object} : number of deactivated documents of ProjectRoute. {status, message, data}
 */
const softDeleteManyProjectRoute = async (req,res) => {
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
    let updatedProjectRoute = await deleteDependentService.softDeleteProjectRoute(query, updateBody);
    if (!updatedProjectRoute) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedProjectRoute });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of ProjectRoute in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyProjectRoute = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedProjectRoute;
    if (req.body.isWarning) {
      deletedProjectRoute = await deleteDependentService.countProjectRoute(query);
    }
    else {
      deletedProjectRoute = await deleteDependentService.deleteProjectRoute(query);
    }
    if (!deletedProjectRoute){
      return res.recordNotFound();
    }
    return res.success({ data :deletedProjectRoute });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate document of ProjectRoute from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of ProjectRoute.
 * @return {Object} : deactivated ProjectRoute. {status, message, data}
 */
const softDeleteProjectRoute = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedProjectRoute = await deleteDependentService.softDeleteProjectRoute(query, updateBody);
    if (!updatedProjectRoute){
      return res.recordNotFound();
    }
    return res.success({ data:updatedProjectRoute });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of ProjectRoute with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated ProjectRoute.
 * @return {obj} : updated ProjectRoute. {status, message, data}
 */
const partialUpdateProjectRoute = async (req,res) => {
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
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedProjectRoute = await dbService.findOneAndUpdateDocument(ProjectRoute, query, dataToUpdate,{ new:true });
    if (!updatedProjectRoute) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedProjectRoute });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of ProjectRoute with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated ProjectRoute.
 * @return {Object} : updated ProjectRoute. {status, message, data}
 */
const updateProjectRoute = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedProjectRoute = await dbService.findOneAndUpdateDocument(ProjectRoute,query,dataToUpdate,{ new:true });
    if (!updatedProjectRoute){
      return res.recordNotFound();
    }
    return res.success({ data :updatedProjectRoute });
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
 * @description : find document of ProjectRoute from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found ProjectRoute. {status, message, data}
 */
const getProjectRoute = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundProjectRoute = await dbService.getSingleDocument(ProjectRoute,query, options);
    if (!foundProjectRoute){
      return res.recordNotFound();
    }
    return res.success({ data :foundProjectRoute });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete document of ProjectRoute from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted ProjectRoute. {status, message, data}
 */
const deleteProjectRoute = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest();
    }
    const query = { _id:req.params.id };
    let deletedProjectRoute;
    if (req.body.isWarning) { 
      deletedProjectRoute = await deleteDependentService.countProjectRoute(query);
    } else {
      deletedProjectRoute = await deleteDependentService.deleteProjectRoute(query);
    }
    if (!deletedProjectRoute){
      return res.recordNotFound();
    }
    return res.success({ data :deletedProjectRoute });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addProjectRoute,
  bulkInsertProjectRoute,
  findAllProjectRoute,
  getProjectRouteCount,
  bulkUpdateProjectRoute,
  softDeleteManyProjectRoute,
  deleteManyProjectRoute,
  softDeleteProjectRoute,
  partialUpdateProjectRoute,
  updateProjectRoute,
  getProjectRoute,
  deleteProjectRoute,
};