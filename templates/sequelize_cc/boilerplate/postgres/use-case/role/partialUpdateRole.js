/**
 *partialUpdateRole.js
 */

const  roleEntity = require('../../entities/role');
const response = require('../../utils/response');
const partialUpdateRole = ({
  roleDb,updateValidation 
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const role = await roleDb.updateOne(query,dataToUpdate);
  if (!role){
    return response.recordNotFound();
  }
  return response.success({ data:role });
};
module.exports = partialUpdateRole;