/**
 *partialUpdateUserRole.js
 */

const  userRoleEntity = require('../../entities/userRole');
const response = require('../../utils/response');
const partialUpdateUserRole = ({
  userRoleDb,updateValidation 
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const userrole = await userRoleDb.updateOne(query,dataToUpdate);
  if (!userrole){
    return response.recordNotFound();
  }
  return response.success({ data:userrole });
};
module.exports = partialUpdateUserRole;