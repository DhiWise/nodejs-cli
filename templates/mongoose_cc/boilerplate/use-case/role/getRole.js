/**
 *getRole.js
 */

const response = require('../../utils/response');

const getRole = ({
  roleDb, filterValidation 
}) => async (params,req,res) => {
  let {
    query, options  
  } = params;
  const validateRequest = await filterValidation(options);
  if (!validateRequest.isValid) {
    return response.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundRole = await roleDb.findOne(query, options);
  if (foundRole){
    return response.success({ data:foundRole });
  }
  return response.recordNotFound();
};
module.exports = getRole;