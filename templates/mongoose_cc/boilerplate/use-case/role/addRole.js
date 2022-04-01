/**
 *addRole.js
 */

const  roleEntity = require('../../entities/role');
const response = require('../../utils/response');
/**
 *
 * /**
 * @description : create documents of document of role in mongodb collection
 * @param {Object} roleDb : db service instance
 * @param {Object} params : {data: data to add}
 * @return {Object} : response of create. {status, message, data}
 */
const addRole = ({
  roleDb,createValidation 
}) => async (dataToCreate,req,res) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let role = roleEntity(dataToCreate);
  role = await roleDb.create(role);
  return response.success({ data:role });
};
module.exports = addRole;