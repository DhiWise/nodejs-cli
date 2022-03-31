
/**
 *deleteUserRole.js
 */
 
const response = require('../../utils/response');
const deleteUserRole = ({ userRoleDb }) => async (query,req,res) => {
  let deletedUserRole = await userRoleDb.deleteOne(query);
  if (!deletedUserRole){
    return response.recordNotFound({});
  }
  return response.success({ data: deletedUserRole });
};

module.exports = deleteUserRole;