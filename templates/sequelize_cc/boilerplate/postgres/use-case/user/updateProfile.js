/**
 *updateProfile.js
 */

const userEntity = require('../../entities/user');
const response = require('../../utils/response');

const updateProfile = ({
  userDb,updateValidation
}) => async (params,req = {},res = {}) => {
  let {
    id, data
  } = params;
  if (id && data){
    delete data.createdAt;
    delete data.updatedAt;
    delete data.id;
    const validateRequest = await updateValidation(data);
    if (!validateRequest.isValid) {
      return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let user = userEntity(data);
    let updatedUser = await userDb.updateOne({ id:id },user);
    return response.success({ data:updatedUser });
  }
  return response.badRequest();
};

module.exports = updateProfile;