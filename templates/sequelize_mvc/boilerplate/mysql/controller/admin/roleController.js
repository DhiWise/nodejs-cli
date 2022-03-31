/**
 * roleController.js
 * @description :: exports action methods for role.
 */

const { Op } = require('sequelize');
const Role = require('../../model/role');
const roleSchemaKey = require('../../utils/validation/roleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of Role in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Role. {status, message, data}
 */ 
const addRole = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      roleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdRole = await dbService.createOne(Role,dataToCreate);
    return  res.success({ data :createdRole });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Role in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Roles. {status, message, data}
 */
const bulkInsertRole = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdRole = await dbService.createMany(Role,dataToCreate);
      return  res.success({ data :createdRole });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find all records of Role from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Role(s). {status, message, data}
 */
const findAllRole = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundRole;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      roleSchemaKey.findFilterKeys,
      Role.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundRole = await dbService.count(Role, query);
      if (!foundRole) {
        return res.recordNotFound();
      } 
      foundRole = { totalRecords: foundRole };
      return res.success({ data :foundRole });
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
    foundRole = await dbService.findMany( Role,query,options);
            
    if (!foundRole){
      return res.recordNotFound();
    }
    return res.success({ data:foundRole });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Role.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getRoleCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      roleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedRole = await dbService.count(Role,where);
    if (!countedRole){
      return res.recordNotFound();
    }
    countedRole = { totalRecords:countedRole };
    return res.success({ data :countedRole });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Role with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Roles.
 * @return {Object} : updated Roles. {status, message, data}
 */
const bulkUpdateRole = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedRole = await dbService.updateMany(Role,filter,dataToUpdate);
    if (!updatedRole){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedRole });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate multiple records of Role from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Role.
 * @return {Object} : number of deactivated documents of Role. {status, message, data}
 */
const softDeleteManyRole = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    if (!req.params || !req.params.id){
      return res.badRequest();
    }            
    query = { id:{ [Op.in]:dataToUpdate.ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    let updatedRole = await deleteDependentService.softDeleteRole(query, updateBody);
    if (!updatedRole) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedRole });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Role in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyRole = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedRole = await deleteDependentService.countRole(query);
      if (!countedRole) {
        return res.recordNotFound();
      }
      return res.success({ data: countedRole });            
    }
    let deletedRole = await deleteDependentService.deleteRole(query);
    if (!deletedRole) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedRole });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Role from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Role.
 * @return {Object} : deactivated Role. {status, message, data}
 */
const softDeleteRole = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedRole = await deleteDependentService.softDeleteRole(query, updateBody);
    if (!updatedRole){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedRole });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Role with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Role.
 * @return {Object} : updated Role. {status, message, data}
 */
const partialUpdateRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      roleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedRole = await dbService.updateMany(Role, query, dataToUpdate);
    if (!updatedRole) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedRole });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Role with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Role.
 * @return {Object} : updated Role. {status, message, data}
 */
const updateRole = async (req, res) => {
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
      roleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedRole = await dbService.updateMany(Role,query,dataToUpdate);

    return  res.success({ data :updatedRole });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Role from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Role. {status, message, data}
 */
const getRole = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundRole = await dbService.findByPk(Role,id,options);
    if (!foundRole){
      return res.recordNotFound();
    }
    return  res.success({ data :foundRole });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Role from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Role. {status, message, data}
 */
const deleteRole = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedRole = await deleteDependentService.countRole(query);
      if (!countedRole){
        return res.recordNotFound();
      }
      return res.success({ data :countedRole });

    } 
    let deletedRole = await deleteDependentService.deleteRole(query);
    if (!deletedRole){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedRole });    
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
