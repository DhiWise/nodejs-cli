/**
 *bulkUpdateUser.js
 */

const response = require('../../utils/response');
/**
 * @description : update multiple records of user with data by filter.
 * @param {obj} userDb : db service instance
 * @param {obj} params : {query: query to find data, dataToUpdate: data to update }
 * @return {obj} : response of bulkUpdate. {status, message, data}
 */
const bulkUpdateUser = ({ userDb }) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const updatedUser = await userDb.updateMany(query,dataToUpdate);
  return response.success({ data:updatedUser });
};
module.exports = bulkUpdateUser;