const response = require('../../../../utils/response'); 
const responseHandler = require('../../../../utils/response/responseHandler'); 
const getSelectObject = require('../../../../utils/getSelectObject'); 

const addUser = (addUserUsecase) => async (req,res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    dataToCreate.addedBy = req.user.id;
    let result = await addUserUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const findAllUser = (findAllUserUsecase) => async (req,res) => {
  try {
    let query = { ...req.body.query || {} };
    let options = { ...req.body.options || {} };
    query.id = { $ne: req.user.id };
    if (req.body && req.body.query && req.body.query.id) {
      query.id.$in = [req.body.query.id];
    }
    let result = await findAllUserUsecase({
      query,
      options,
      isCountOnly:req.body.isCountOnly || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getUserCount = (getUserCountUsecase) => async (req,res) => {
  try {
    let where = { ...req.body.where || {} };
    let result = await getUserCountUsecase({ where },req,res);  
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteManyUser = (softDeleteManyUserUsecase) => async (req,res) => {
  try {
    if (!req.body || !req.body.ids){
      return responseHandler(res,response.badRequest());
    }
    let ids = req.body.ids;
    let query = { id : { $in:ids } };
    query.id.$ne = req.user.id;
    const dataToUpdate = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let result = await softDeleteManyUserUsecase({
      data:req.body,
      query,
      dataToUpdate
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkInsertUser = (bulkInsertUserUsecase)=> async (req,res) => {
  try {
    let dataToCreate = req.body.data;
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy:req.user.id,
      };
    }
    let result = await bulkInsertUserUsecase(dataToCreate,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const bulkUpdateUser = (bulkUpdateUserUsecase) => async (req,res) => {
  try {
    let dataToUpdate = { ...req.body.data || {} };
    let query = { ...req.body.filter || {} };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    query.id = { $ne: req.user.id };
    if (req.body.filter && req.body.filter.id){
      query.id.$in = [req.body.filter.id];
    }
    let result = await bulkUpdateUserUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteManyUser = (deleteManyUserUsecase) => async (req,res) => {
  try {
    if (!req.body || !req.body.ids){
      return responseHandler(res,response.badRequest());
    }
    let ids = req.body.ids;
    let query = { id : { $in:ids } };
    query.id.$ne = req.user.id;
    let result = await deleteManyUserUsecase({
      data:req.body,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const softDeleteUser = (softDeleteUserUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    query.id.$ne = req.user.id;
    const dataToUpdate = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let result = await softDeleteUserUsecase({
      data:req.body,
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const partialUpdateUser = (partialUpdateUserUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    let dataToUpdate = req.body;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    query.id.$ne = req.user.id;
    let result = await partialUpdateUserUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const updateUser = (updateUserUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let dataToUpdate = { ...req.body || {} };
    let query = { id: req.params.id };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    query.id.$ne = req.user.id;
    let result = await updateUserUsecase({
      dataToUpdate,
      query
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getUser = (getUserUsecase) => async (req,res) =>{
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let options = {};
    let query = { id: req.params.id };
    let result = await getUserUsecase({
      query,
      options
    },req,res);
    return responseHandler(res,result);
  } catch (error) {
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const deleteUser = (deleteUserUsecase) => async (req,res) => {
  try {
    if (!req.params.id){
      return responseHandler(res,response.badRequest());
    }
    let query = { id: req.params.id };
    query.id.$ne = req.user.id;
    let result = await deleteUserUsecase({
      query,
      isWarning: req.body.isWarning || false
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const changePassword = (changePasswordUsecase) => async (req,res) => {
  try {
    let result = await changePasswordUsecase(req.body,req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};  

const updateProfile = (updateProfileUsecase) => async (req,res) => {
  try {
    let result = await updateProfileUsecase({
      data:req.body,
      id:req.user.id
    },req,res);
    return responseHandler(res,result);
  } catch (error){
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

const getLoggedInUserInfo = (getUserUsecase) => async (req,res) =>{
  try {
    const options = {};
    const query = {
      id : req.user.id,
      isDeleted: false,
      isActive: true
    };
    let result = await getUserUsecase({
      query,
      options 
    },req,res);
    return responseHandler(res,result);
  } catch (error) {
    return responseHandler(res,response.internalServerError({ message:error.message }));
  }
};

module.exports = {
  addUser,
  findAllUser,
  getUserCount,
  softDeleteManyUser,
  bulkInsertUser,
  bulkUpdateUser,
  deleteManyUser,
  softDeleteUser,
  partialUpdateUser,
  updateUser,
  getUser,
  deleteUser,
  changePassword,
  updateProfile,
  getLoggedInUserInfo
};
