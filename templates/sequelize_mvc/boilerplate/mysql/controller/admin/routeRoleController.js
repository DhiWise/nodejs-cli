/**
 * routeRoleController.js
 * @description :: exports action methods for routeRole.
 */

const { Op } = require('sequelize');
const RouteRole = require('../../model/routeRole');
const routeRoleSchemaKey = require('../../utils/validation/routeRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of RouteRole in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created RouteRole. {status, message, data}
 */ 
const addRouteRole = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      routeRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdRouteRole = await dbService.createOne(RouteRole,dataToCreate);
    return  res.success({ data :createdRouteRole });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of RouteRole in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created RouteRoles. {status, message, data}
 */
const bulkInsertRouteRole = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdRouteRole = await dbService.createMany(RouteRole,dataToCreate);
      return  res.success({ data :createdRouteRole });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find all records of RouteRole from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found RouteRole(s). {status, message, data}
 */
const findAllRouteRole = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundRouteRole;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      routeRoleSchemaKey.findFilterKeys,
      RouteRole.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundRouteRole = await dbService.count(RouteRole, query);
      if (!foundRouteRole) {
        return res.recordNotFound();
      } 
      foundRouteRole = { totalRecords: foundRouteRole };
      return res.success({ data :foundRouteRole });
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
    foundRouteRole = await dbService.findMany( RouteRole,query,options);
            
    if (!foundRouteRole){
      return res.recordNotFound();
    }
    return res.success({ data:foundRouteRole });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of RouteRole.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getRouteRoleCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      routeRoleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedRouteRole = await dbService.count(RouteRole,where);
    if (!countedRouteRole){
      return res.recordNotFound();
    }
    countedRouteRole = { totalRecords:countedRouteRole };
    return res.success({ data :countedRouteRole });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of RouteRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated RouteRoles.
 * @return {Object} : updated RouteRoles. {status, message, data}
 */
const bulkUpdateRouteRole = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedRouteRole = await dbService.updateMany(RouteRole,filter,dataToUpdate);
    if (!updatedRouteRole){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedRouteRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate multiple records of RouteRole from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of RouteRole.
 * @return {Object} : number of deactivated documents of RouteRole. {status, message, data}
 */
const softDeleteManyRouteRole = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(RouteRole,query,updateBody, options);
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
 * @description : delete records of RouteRole in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyRouteRole = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedRouteRole = await dbService.deleteMany(RouteRole,query);
    return res.success({ data :deletedRouteRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of RouteRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of RouteRole.
 * @return {Object} : deactivated RouteRole. {status, message, data}
 */
const softDeleteRouteRole = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(RouteRole, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of RouteRole with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated RouteRole.
 * @return {Object} : updated RouteRole. {status, message, data}
 */
const partialUpdateRouteRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      routeRoleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedRouteRole = await dbService.updateMany(RouteRole, query, dataToUpdate);
    if (!updatedRouteRole) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedRouteRole });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of RouteRole with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated RouteRole.
 * @return {Object} : updated RouteRole. {status, message, data}
 */
const updateRouteRole = async (req, res) => {
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
      routeRoleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedRouteRole = await dbService.updateMany(RouteRole,query,dataToUpdate);

    return  res.success({ data :updatedRouteRole });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of RouteRole from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found RouteRole. {status, message, data}
 */
const getRouteRole = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundRouteRole = await dbService.findByPk(RouteRole,id,options);
    if (!foundRouteRole){
      return res.recordNotFound();
    }
    return  res.success({ data :foundRouteRole });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of RouteRole from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted RouteRole. {status, message, data}
 */
const deleteRouteRole = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(RouteRole, req.params.id);
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
