/**
 *partialUpdateProjectRoute.js
 */

const response = require('../../utils/response');
const partialUpdateProjectRoute = ({ projectRouteDb }) => async (params,req,res) => {
  const projectroute = await projectRouteDb.updateOne(params.query,params.dataToUpdate);
  if (!projectroute){
    return response.recordNotFound();
  }
  return response.success({ data:projectroute });
};
module.exports = partialUpdateProjectRoute;