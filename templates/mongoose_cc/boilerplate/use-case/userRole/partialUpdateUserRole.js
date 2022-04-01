/**
 *partialUpdateUserRole.js
 */

const response = require('../../utils/response');
const partialUpdateUserRole = ({ userRoleDb }) => async (params,req,res) => {
  const userrole = await userRoleDb.updateOne(params.query,params.dataToUpdate);
  if (!userrole){
    return response.recordNotFound();
  }
  return response.success({ data:userrole });
};
module.exports = partialUpdateUserRole;