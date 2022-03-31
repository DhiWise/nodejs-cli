/**
 *bulkUpdateRouteRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of routeRole with data by filter.
 * @param {obj} routeRoleDb : db service instance
 * @param {obj} params : {query: query to find data, dataToUpdate: data to update }
 * @return {obj} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateRouteRole = ({ routeRoleDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const updatedRouteRole = await routeRoleDb.updateMany(query,dataToUpdate);
  return response.success({ data:updatedRouteRole });
};
module.exports = bulkUpdateRouteRole;