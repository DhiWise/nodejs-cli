/**
 *getUserCount.js
 */

const response = require('../../utils/response');
/**
 * @description : returns total number of documents of user
 * @param {obj} userDb : db service instance
 * @param {obj} params : {where: query to find data}
 * @return {obj} : response of count. {status, message, data}
 */
const getUserCount = ({
  userDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let { where } = params;
  const validateRequest = await filterValidation(where);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let countedUser = await userDb.count(where);
  countedUser = { totalRecords:countedUser };
  return response.success({ data:countedUser });
};
module.exports = getUserCount;