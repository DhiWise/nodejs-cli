
/**
 *bulkInsertRole.js
 */

const  roleEntity = require('../../entities/role');
const response = require('../../utils/response');

const bulkInsertRole = ({ roleDb }) => async (dataToCreate,req,res) => {
  let roleEntities = dataToCreate.map(item => roleEntity(item));
  let createdRole = await roleDb.createMany(roleEntities);
  return response.success({ data:createdRole });
};
module.exports = bulkInsertRole;