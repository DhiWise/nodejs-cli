/**
 *findAllRole.js
 */

const response = require('../../utils/response');
const findAllRole = ({
  roleDb,filterValidation 
}) => async (params,req = {},res = {}) => {
  let {
    options, query, isCountOnly 
  } = params;
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let foundRole;
  if (isCountOnly){
    foundRole = await roleDb.count(query);
    foundRole = { totalRecords: foundRole };
    return response.success({ data:foundRole });  
  }
  else {
    foundRole = await roleDb.paginate(query,options);
    if (!foundRole){
      return response.recordNotFound();
    }
    return response.success({ data:foundRole });
  }
};
module.exports = findAllRole;