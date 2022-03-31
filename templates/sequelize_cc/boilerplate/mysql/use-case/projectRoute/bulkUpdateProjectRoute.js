/**
 *bulkUpdateProjectRoute.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of projectRoute with data by filter.
 * @param {obj} projectRouteDb : db service instance
 * @param {obj} params : {query: query to find data, dataToUpdate: data to update }
 * @return {obj} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateProjectRoute = ({ projectRouteDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const updatedProjectRoute = await projectRouteDb.updateMany(query,dataToUpdate);
  return response.success({ data:updatedProjectRoute });
};
module.exports = bulkUpdateProjectRoute;