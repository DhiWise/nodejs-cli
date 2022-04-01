const response = require('../../../utils/response'); 
const responseHandler = require('../../../utils/response/responseHandler'); 
const getSelectObject = require('../../../utils/getSelectObject'); 

const addProjectRoute = (addProjectRouteUsecase) => async (req,res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    dataToCreate.addedBy = req.user.id;
    let result = await addProjectRouteUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkInsertProjectRoute = (bulkInsertProjectRouteUsecase)=> async (req,res) => {
  try {
    let dataToCreate = req.body.data;
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy:req.user.id,
      };
    }
    let result = await bulkInsertProjectRouteUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const findAllProjectRoute = (findAllProjectRouteUsecase) => async (req,res) => {
  try {
    let query = { ...req.body.query || {} };
    let options = { ...req.body.options || {} };
    let result = await findAllProjectRouteUsecase({
      query,
      options,
      isCountOnly:req.body.isCountOnly || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getProjectRouteCount = (getProjectRouteCountUsecase) => async (req,res) => {
  try {
    let where = { ...req.body.where || {} };
    let result = await getProjectRouteCountUsecase({ where },req,res);  
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkUpdateProjectRoute = (bulkUpdateProjectRouteUsecase) => async (req,res) => {
  try {
    let dataToUpdate = { ...req.body.data || {} };
    let query = { ...req.body.filter || {} };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await bulkUpdateProjectRouteUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteManyProjectRoute = (softDeleteManyProjectRouteUsecase) => async (req,res) => {
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
    let result = await softDeleteManyProjectRouteUsecase({
      data:req.body,
      query,
      dataToUpdate
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteManyProjectRoute = (deleteManyProjectRouteUsecase) => async (req,res) => {
  try {
    if (!req.body || !req.body.ids){
      return responseHandler(res,response.badRequest());
    }
    let ids = req.body.ids;
    let query = { id : { $in:ids } };
    let result = await deleteManyProjectRouteUsecase({
      data:req.body,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteProjectRoute = (softDeleteProjectRouteUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    const dataToUpdate = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let result = await softDeleteProjectRouteUsecase({
      data:req.body,
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const partialUpdateProjectRoute = (partialUpdateProjectRouteUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    let dataToUpdate = req.body;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await partialUpdateProjectRouteUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const updateProjectRoute = (updateProjectRouteUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let dataToUpdate = { ...req.body || {} };
    let query = { id: req.params.id };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let result = await updateProjectRouteUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getProjectRoute = (getProjectRouteUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let options = {};
    let query = { id: req.params.id };
    let result = await getProjectRouteUsecase({
      query,
      options
    },req,res);
    return responseHandler(res,result);
  } catch (error) {
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteProjectRoute = (deleteProjectRouteUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    let result = await deleteProjectRouteUsecase({
      query,
      isWarning: req.body.isWarning || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
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
  deleteProjectRoute
};
