
/**
 *bulkInsertUser.js
 */

const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
const bulkInsertUser = ({
  userDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  let userEntities = dataToCreate.map(item => userEntity(item));
  let createdUser = await userDb.createMany(userEntities);
  return response.success({ data:createdUser });
};
module.exports = bulkInsertUser;