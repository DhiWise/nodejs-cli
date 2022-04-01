/**
 *partialUpdateRole.js
 */

const response = require('../../utils/response');
const partialUpdateRole = ({ roleDb }) => async (params,req,res) => {
  const role = await roleDb.updateOne(params.query,params.dataToUpdate);
  if (!role){
    return response.recordNotFound();
  }
  return response.success({ data:role });
};
module.exports = partialUpdateRole;