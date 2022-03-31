/**
 *bulkUpdateUserRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of userRole with data by filter.
 * @param {obj} userRoleDb : db service instance
 * @param {obj} params : {query: query to find data, dataToUpdate: data to update }
 * @return {obj} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateUserRole = ({ userRoleDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const updatedUserRole = await userRoleDb.updateMany(query,dataToUpdate);
  return response.success({ data:updatedUserRole });
};
module.exports = bulkUpdateUserRole;