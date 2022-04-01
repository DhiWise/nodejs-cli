/**
 *getProjectRouteCount.js
 */

const response = require('../../utils/response');
/**
 * /**
 * @description : returns total number of documents of projectRoute
 * @param {Object} projectRouteDb : db service instance
 * @param {Object} params : {where: query to find data}
 * @return {Object} : response of count. {status, message, data}
 */
const getProjectRouteCount = ({
  projectRouteDb,filterValidation 
}) => async (params,req,res) => {
  let { where } = params;
  const validateRequest = await filterValidation(where);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let result = await projectRouteDb.count(where);
  result = { totalRecords:result };
  return response.success({ data:result });
};
module.exports = getProjectRouteCount;