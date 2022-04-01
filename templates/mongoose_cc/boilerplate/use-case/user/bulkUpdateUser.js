/**
 *bulkUpdateUser.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of user with data by filter.
 * @param {Object} userDb : db service instance
 * @param {Object} params : {query: query to find data, data: data to update }
 * @return {Object} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateUser = ({ userDb }) => async (params,req,res) => {
  const updatedUser = await userDb.updateMany(params.query,params.dataToUpdate);
  return response.success({ data:updatedUser });
};
module.exports = bulkUpdateUser;