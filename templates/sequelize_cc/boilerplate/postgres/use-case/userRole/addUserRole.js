
/**
 *addUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
/**
 * @description : create documents of document of userRole in mongodb collection
 * @param {obj} userRoleDb : db service instance
 * @param {obj} params : {dataToCreate: data to add}
 * @return {obj} : response of create. {status, message, data}
 */
const addUserRole = ({
  userRoleDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let createdUserRole  = userRoleEntity(dataToCreate);
  createdUserRole = await userRoleDb.create(createdUserRole );
  return response.success({ data:createdUserRole });
};
module.exports = addUserRole;