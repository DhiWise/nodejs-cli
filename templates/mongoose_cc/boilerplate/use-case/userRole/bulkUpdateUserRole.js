/**
 *bulkUpdateUserRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of userRole with data by filter.
 * @param {Object} userRoleDb : db service instance
 * @param {Object} params : {query: query to find data, data: data to update }
 * @return {Object} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateUserRole = ({ userRoleDb }) => async (params,req,res) => {
  const updatedUserRole = await userRoleDb.updateMany(params.query,params.dataToUpdate);
  return response.success({ data:updatedUserRole });
};
module.exports = bulkUpdateUserRole;