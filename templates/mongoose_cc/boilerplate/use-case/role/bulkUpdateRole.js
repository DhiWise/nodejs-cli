/**
 *bulkUpdateRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of role with data by filter.
 * @param {Object} roleDb : db service instance
 * @param {Object} params : {query: query to find data, data: data to update }
 * @return {Object} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateRole = ({ roleDb }) => async (params,req,res) => {
  const updatedRole = await roleDb.updateMany(params.query,params.dataToUpdate);
  return response.success({ data:updatedRole });
};
module.exports = bulkUpdateRole;