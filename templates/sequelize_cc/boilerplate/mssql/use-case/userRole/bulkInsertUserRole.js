
/**
 *bulkInsertUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
const bulkInsertUserRole = ({
  userRoleDb,createValidation 
}) => async (dataToCreate,req = {},res = {}) => {
  let userroleEntities = dataToCreate.map(item => userRoleEntity(item));
  let createdUserRole = await userRoleDb.createMany(userroleEntities);
  return response.success({ data:createdUserRole });
};
module.exports = bulkInsertUserRole;