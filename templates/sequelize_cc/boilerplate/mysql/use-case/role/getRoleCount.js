/**
 *getRoleCount.js
 */

const response = require('../../utils/response');
/**
 * @description : returns total number of documents of role
 * @param {obj} roleDb : db service instance
 * @param {obj} params : {where: query to find data}
 * @return {obj} : response of count. {status, message, data}
 */
const getRoleCount = ({
  roleDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let { where } = params;
  const validateRequest = await filterValidation(where);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let countedRole = await roleDb.count(where);
  countedRole = { totalRecords:countedRole };
  return response.success({ data:countedRole });
};
module.exports = getRoleCount;