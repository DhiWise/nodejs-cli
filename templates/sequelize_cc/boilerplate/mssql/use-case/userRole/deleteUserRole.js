
/**
 *deleteUserRole.js
 */

const response = require('../../utils/response');
const deleteUserRole = ({ userRoleDb }) => async (params) => {
  let { query } = params;
  let deletedUserRole = await userRoleDb.deleteOne(query);
  if (!deletedUserRole){
    return response.recordNotFound({ });
  }
  return response.success({ data: deletedUserRole });
};

module.exports = deleteUserRole;
