/**
 *bulkUpdateProjectRoute.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of projectRoute with data by filter.
 * @param {Object} projectRouteDb : db service instance
 * @param {Object} params : {query: query to find data, data: data to update }
 * @return {Object} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateProjectRoute = ({ projectRouteDb }) => async (params,req,res) => {
  const updatedProjectRoute = await projectRouteDb.updateMany(params.query,params.dataToUpdate);
  return response.success({ data:updatedProjectRoute });
};
module.exports = bulkUpdateProjectRoute;