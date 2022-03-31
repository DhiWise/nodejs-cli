/**
 *partialUpdateProjectRoute.js
 */

const  projectRouteEntity = require('../../entities/projectRoute');
const response = require('../../utils/response');
const partialUpdateProjectRoute = ({
  projectRouteDb,updateValidation 
}) => async (params,req = {},res = {}) => {
  let {
    dataToUpdate, query 
  } = params;
  const projectroute = await projectRouteDb.updateOne(query,dataToUpdate);
  if (!projectroute){
    return response.recordNotFound();
  }
  return response.success({ data:projectroute });
};
module.exports = partialUpdateProjectRoute;