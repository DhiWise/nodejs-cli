const ProjectRoute = require('../../model/projectRoute');
const projectRouteSchemaKey = require('../../utils/validation/projectRouteValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const deleteDependentService = require('../../utils/deleteDependent');
    
const addProjectRoute = async (req, res) => {
  try {
    let validateRequest = validation.validateParamsWithJoi(
      req.body,
      projectRouteSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    let data = new ProjectRoute({
      ...req.body
      ,addedBy:req.user.id
    });
    let result = await dbService.createDocument(ProjectRoute,data);
    return  res.ok({ data : result });
  } catch (error) {
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    if (error.code && error.code == 11000){
      return res.isDuplicate();
    }
    return res.failureResponse(); 
  }
};

const bulkInsertProjectRoute = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;
      for (let i = 0;i < data.length;i++){
        Object.assign(data[i],{ addedBy:req.user.id });
      }
      let result = await dbService.bulkInsert(ProjectRoute,data);
      return  res.ok({ data :result });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code == 11000){
      return res.isDuplicate();
    }
    return res.failureResponse();
  }
};
    
const findAllProjectRoute = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body.query !== undefined) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      result = await dbService.countDocument(ProjectRoute, query);
      if (result) {
        result = { totalRecords: result };
        return res.ok({ data :result });
      } 
      return res.recordNotFound();
    }
    else {
      if (req.body.options !== undefined) {
        /*
         * if(req.body.options.populate){
         *   delete req.body.options.populate;
         * }
         */
        options = { ...req.body.options };
      }
      result = await dbService.getAllDocuments( ProjectRoute,query,options);
      if (result && result.data && result.data.length){
        return res.ok({ data :result });   
      }
      return res.recordNotFound();
    }
  }
  catch (error){
    return res.failureResponse();
  }
};

const getProjectRoute = async (req,res) => {
  try {
    let query = {};
    query._id = req.params.id;
    let options = {};
    if (req.body && req.body.populate && req.body.populate.length) options.populate = req.body.populate;
    if (req.body && req.body.select && req.body.select.length) options.select = req.body.select;
    let result = await dbService.getSingleDocument(ProjectRoute,query, options);
    if (result){
            
      return  res.ok({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.failureResponse();
  }
};
    
const partialUpdateProjectRoute = async (req,res) => {
  try {
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    let data = {
      ...req.body,
      id: req.params.id
    };
    let validateRequest = validation.validateParamsWithJoi(
      data,
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let result = await dbService.findOneAndUpdateDocument(ProjectRoute, query, data,{ new:true });
    if (!result) {
      return res.recordNotFound();
    }

    return res.ok({ data:result });
  }
  catch (error){
    return res.failureResponse();
  }
};

const softDeleteProjectRoute = async (req,res) => {
  try {
    let query = { _id:req.params.id };
    let result = await deleteDependentService.softDeleteProjectRoute(query,req.user);
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data:result });
  } catch (error){
    return res.failureResponse(); 
  }
};
    
const updateProjectRoute = async (req,res) => {
  try {
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    let data = {
      ...req.body,
      id:req.params.id
      ,updatedBy:req.user.id
    };
    let validateRequest = validation.validateParamsWithJoi(
      data,
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let query = { _id:req.params.id };
    let result = await dbService.findOneAndUpdateDocument(ProjectRoute,query,data,{ new:true });
    if (!result){
      return res.recordNotFound();
    }
    return  res.ok({ data:result });
  }
  catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code == 11000){
      return res.isDuplicate();
    }
    return res.failureResponse();
  }
};
const getProjectRouteByAggregate = async (req,res)=>{
  try {
    let result = await dbService.getDocumentByAggregation(ProjectRoute,req.body);
    if (result){
      return res.ok({ data :result });
    }
    return res.recordNotFound();
  } catch (error){
    return res.failureResponse(error.message);
  }
};
    
const getProjectRouteCount = async (req,res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.countDocument(ProjectRoute,where);
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

const upsert = async (req,res) => {
  try {
    delete req.body['addedBy'];
    delete req.body['updatedBy'];
    let params = req.body;
    let validateRequest = validation.validateParamsWithJoi(
      params,
      projectRouteSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.inValidParam({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    if (params.id) {
      let where = params.id;
      ['id','createdAt','updatedAt'].forEach(e => delete params[e]);
      params.updatedBy = req.user.id;
      let result = await dbService.updateDocument(ProjectRoute, where, params);
      if (!result){
        return res.recordNotFound();
      }
      return res.ok({ data:result });
    }
    else {
      params.addedBy = req.user.id;
      let data = new ProjectRoute({ ...params });
      let result = await dbService.createDocument(ProjectRoute, data);
      if (!result){
        return res.recordNotFound();
      }
      return res.ok({ data:result });    
    }
  }
  catch (error){
    if (error.name === 'ValidationError'){
      return res.validationError({ message : `Invalid Data, Validation Failed at ${ error.message}` });
    }
    else if (error.code && error.code == 11000){
      return res.isDuplicate();
    }
    return res.failureResponse(); 
  }
};

const bulkUpdateProjectRoute = async (req,res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = { ...req.body.data };
      delete data['addedBy'];
      delete data['updatedBy'];
      data.updatedBy = req.user.id;
      let result = await dbService.bulkUpdate(ProjectRoute,filter,data);
      if (!result){
        return res.recordNotFound();
      }
      return  res.ok({ data :result });
    }
    else {
      return res.badRequest();
    }
  }
  catch (error){
    return res.failureResponse(); 
  }
};

module.exports = {
  addProjectRoute,
  bulkInsertProjectRoute,
  findAllProjectRoute,
  getProjectRoute,
  partialUpdateProjectRoute,
  softDeleteProjectRoute,
  updateProjectRoute,
  getProjectRouteByAggregate,
  getProjectRouteCount,
  upsert,
  bulkUpdateProjectRoute,
};