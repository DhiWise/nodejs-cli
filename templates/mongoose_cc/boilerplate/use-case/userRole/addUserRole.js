/**
 *addUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
/**
 *
 * /**
 * @description : create documents of document of userRole in mongodb collection
 * @param {Object} userRoleDb : db service instance
 * @param {Object} params : {data: data to add}
 * @return {Object} : response of create. {status, message, data}
 */
const addUserRole = ({
  userRoleDb,createValidation 
}) => async (dataToCreate,req,res) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let userRole = userRoleEntity(dataToCreate);
  userRole = await userRoleDb.create(userRole);
  return response.success({ data:userRole });
};
module.exports = addUserRole;