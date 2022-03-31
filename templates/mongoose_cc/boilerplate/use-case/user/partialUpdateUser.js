/**
 *partialUpdateUser.js
 */

const response = require('../../utils/response');
const partialUpdateUser = ({ userDb }) => async (params,req,res) => {
  const user = await userDb.updateOne(params.query,params.dataToUpdate);
  if (!user){
    return response.recordNotFound();
  }
  return response.success({ data:user });
};
module.exports = partialUpdateUser;