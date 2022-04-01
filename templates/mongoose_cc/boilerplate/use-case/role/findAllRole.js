/**
 *findAllRole.js
 */

const response = require('../../utils/response');
const findAllRole = ({
  roleDb,filterValidation 
}) => async (params,req,res) => {
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let {
    query, options, isCountOnly 
  } = params;
  let foundRole;
  if (isCountOnly){
    foundRole = await roleDb.count(query);
    foundRole = { totalRecords: foundRole };
  }
  else {
    foundRole = await roleDb.paginate(query,options);
    if (!foundRole){
      return response.recordNotFound();
    }
  }
  return response.success({ data:foundRole });  
};
module.exports = findAllRole;