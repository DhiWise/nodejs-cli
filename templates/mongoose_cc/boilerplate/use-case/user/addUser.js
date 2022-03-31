/**
 *addUser.js
 */

const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
/**
 *
 * /**
 * @description : create documents of document of user in mongodb collection
 * @param {Object} userDb : db service instance
 * @param {Object} params : {data: data to add}
 * @return {Object} : response of create. {status, message, data}
 */
const addUser = ({
  userDb,createValidation 
}) => async (dataToCreate,req,res) => {
  const validateRequest = await createValidation(dataToCreate);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let user = userEntity(dataToCreate);
  user = await userDb.create(user);
  return response.success({ data:user });
};
module.exports = addUser;