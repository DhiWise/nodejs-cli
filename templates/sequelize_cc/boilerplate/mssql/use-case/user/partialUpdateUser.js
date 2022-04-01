/**
 *partialUpdateUser.js
 */

const  userEntity = require('../../entities/user');
const response = require('../../utils/response');
const partialUpdateUser = ({
  userDb,updateValidation 
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const user = await userDb.updateOne(query,dataToUpdate);
  if (!user){
    return response.recordNotFound();
  }
  return response.success({ data:user });
};
module.exports = partialUpdateUser;