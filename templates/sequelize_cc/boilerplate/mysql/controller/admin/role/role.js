const response = require('../../../utils/response'); 
const responseHandler = require('../../../utils/response/responseHandler'); 
const getSelectObject = require('../../../utils/getSelectObject'); 

const addRole = (addRoleUsecase) => async (req,res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    dataToCreate.addedBy = req.user.id;
    let result = await addRoleUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkInsertRole = (bulkInsertRoleUsecase)=> async (req,res) => {
  try {
    let dataToCreate = req.body.data;
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy:req.user.id,
      };
    }
    let result = await bulkInsertRoleUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const findAllRole = (findAllRoleUsecase) => async (req,res) => {
  try {
    let query = { ...req.body.query || {} };
    let options = { ...req.body.options || {} };
    let result = await findAllRoleUsecase({
      query,
      options,
      isCountOnly:req.body.isCountOnly || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getRoleCount = (getRoleCountUsecase) => async (req,res) => {
  try {
    let where = { ...req.body.where || {} };
    let result = await getRoleCountUsecase({ where },req,res);  
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkUpdateRole = (bulkUpdateRoleUsecase) => async (req,res) => {
  try {
    let dataToUpdate = { ...req.body.data || {} };
    let query = { ...req.body.filter || {} };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await bulkUpdateRoleUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteManyRole = (softDeleteManyRoleUsecase) => async (req,res) => {
  try {
    if (!req.body || !req.body.ids){
      return responseHandler(res,response.badRequest());
    }
    let ids = req.body.ids;
    let query = { id : { $in:ids } };
    const dataToUpdate = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let result = await softDeleteManyRoleUsecase({
      data:req.body,
      query,
      dataToUpdate
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteManyRole = (deleteManyRoleUsecase) => async (req,res) => {
  try {
    if (!req.body || !req.body.ids){
      return responseHandler(res,response.badRequest());
    }
    let ids = req.body.ids;
    let query = { id : { $in:ids } };
    let result = await deleteManyRoleUsecase({
      data:req.body,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteRole = (softDeleteRoleUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    const dataToUpdate = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let result = await softDeleteRoleUsecase({
      data:req.body,
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const partialUpdateRole = (partialUpdateRoleUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    let dataToUpdate = req.body;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await partialUpdateRoleUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const updateRole = (updateRoleUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let dataToUpdate = { ...req.body || {} };
    let query = { id: req.params.id };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await updateRoleUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getRole = (getRoleUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let options = {};
    let query = { id: req.params.id };
    let result = await getRoleUsecase({
      query,
      options
    },req,res);
    return responseHandler(res,result);
  } catch (error) {
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteRole = (deleteRoleUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    let result = await deleteRoleUsecase({
      query,
      isWarning: req.body.isWarning || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
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
  deleteRole
};
