/**
 *getUserRoleCount.js
 */

const response = require('../../utils/response');
/**
 * @description : returns total number of documents of userRole
 * @param {obj} userRoleDb : db service instance
 * @param {obj} params : {where: query to find data}
 * @return {obj} : response of count. {status, message, data}
 */
const getUserRoleCount = ({
  userRoleDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let { where } = params;
  const validateRequest = await filterValidation(where);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let countedUserRole = await userRoleDb.count(where);
  countedUserRole = { totalRecords:countedUserRole };
  return response.success({ data:countedUserRole });
};
module.exports = getUserRoleCount;