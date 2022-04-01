
/**
 *addUser.js
 */

const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
/**
 * @description : create documents of document of user in mongodb collection
 * @param {obj} userDb : db service instance
 * @param {obj} params : {dataToCreate: data to add}
 * @return {obj} : response of create. {status, message, data}
 */
const addUser = ({
  userDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let createdUser  = userEntity(dataToCreate);
  createdUser = await userDb.create(createdUser );
  return response.success({ data:createdUser });
};
module.exports = addUser;