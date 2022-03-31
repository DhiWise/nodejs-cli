/**
 *bulkUpdateRole.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of role with data by filter.
 * @param {obj} roleDb : db service instance
 * @param {obj} params : {query: query to find data, dataToUpdate: data to update }
 * @return {obj} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateRole = ({ roleDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const updatedRole = await roleDb.updateMany(query,dataToUpdate);
  return response.success({ data:updatedRole });
};
module.exports = bulkUpdateRole;