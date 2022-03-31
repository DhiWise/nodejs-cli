
/**
 *addRole.js
 */

const  roleEntity = require('../../entities/role');
const response = require('../../utils/response');
/**
 * @description : create documents of document of role in mongodb collection
 * @param {obj} roleDb : db service instance
 * @param {obj} params : {dataToCreate: data to add}
 * @return {obj} : response of create. {status, message, data}
 */
const addRole = ({
  roleDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let createdRole  = roleEntity(dataToCreate);
  createdRole = await roleDb.create(createdRole );
  return response.success({ data:createdRole });
};
module.exports = addRole;