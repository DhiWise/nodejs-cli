/**
 *updateUser.js
 */

const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
const updateUser = ({
  userDb, updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const validateRequest = await updateValidation(dataToUpdate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let updatedUser = userEntity(dataToUpdate);
  updatedUser = await userDb.updateOne(query,updatedUser);
  if (!updatedUser){
    return response.recordNotFound();
  }
  return response.success({ data:updatedUser });
};
module.exports = updateUser;