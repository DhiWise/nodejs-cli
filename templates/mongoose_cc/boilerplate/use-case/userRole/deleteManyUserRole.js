/**
 *deleteManyUserRole.js
 */

const response = require('../../utils/response');
const deleteManyUserRole = ({ userRoleDb }) => async (query,req,res) => {
  let deletedUserRole = await userRoleDb.deleteMany(query);
  return response.success({ data:deletedUserRole });
};
module.exports = deleteManyUserRole;