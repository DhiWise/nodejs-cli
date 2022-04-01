/**
 *getProjectRouteCount.js
 */

const response = require('../../utils/response');
/**
 * @description : returns total number of documents of projectRoute
 * @param {obj} projectRouteDb : db service instance
 * @param {obj} params : {where: query to find data}
 * @return {obj} : response of count. {status, message, data}
 */
const getProjectRouteCount = ({
  projectRouteDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let { where } = params;
  const validateRequest = await filterValidation(where);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let countedProjectRoute = await projectRouteDb.count(where);
  countedProjectRoute = { totalRecords:countedProjectRoute };
  return response.success({ data:countedProjectRoute });
};
module.exports = getProjectRouteCount;