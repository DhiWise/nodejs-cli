/**
 *findAllUser.js
 */

const response = require('../../utils/response');
const findAllUser = ({
  userDb,filterValidation 
}) => async (params,req,res) => {
  const validateRequest = await filterValidation(params);
  if (!validateRequest.isValid) {
    return response.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
  }
  let {
    query, options, isCountOnly 
  } = params;
  let foundUser;
  if (isCountOnly){
    foundUser = await userDb.count(query);
    foundUser = { totalRecords: foundUser };
  }
  else {
    foundUser = await userDb.paginate(query,options);
    if (!foundUser){
      return response.recordNotFound();
    }
  }
  return response.success({ data:foundUser });  
};
module.exports = findAllUser;