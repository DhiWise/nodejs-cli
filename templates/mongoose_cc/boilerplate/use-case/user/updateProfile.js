/**
 *updateProfile.js
 */

const userEntity = require('../../entities/user');
const response = require('../../utils/response');

const updateProfile = ({
  userDb,updateValidation
}) => async (params) => {
  let {
    id, profileData
  } = params;
  if (id && profileData){
    delete profileData.createdAt;
    delete profileData.updatedAt;
    delete profileData.id;
    const validateRequest = await updateValidation(profileData);
    if (!validateRequest.isValid) {
      return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    let user = userEntity(profileData);
    let updatedUser = await userDb.updateOne({ _id:id }, user);
    return response.success({ data:updatedUser });
  }
  return response.badRequest();
};

module.exports = updateProfile;