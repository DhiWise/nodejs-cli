/**
 *bulkUpdateRouteRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of routeRole with data by filter.
 * @param {Object} routeRoleDb : db service instance
 * @param {Object} params : {query: query to find data, data: data to update }
 * @return {Object} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateRouteRole = ({ routeRoleDb }) => async (params,req,res) => {
  const updatedRouteRole = await routeRoleDb.updateMany(params.query,params.dataToUpdate);
  return response.success({ data:updatedRouteRole });
};
module.exports = bulkUpdateRouteRole;