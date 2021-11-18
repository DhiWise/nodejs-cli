
function buildMakeUserTokens ({
  insertUserTokensValidator,updateUserTokensValidator
}){
  return function makeUserTokens (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserTokensValidator':
      isValid = insertUserTokensValidator(data);
      break;

    case 'updateUserTokensValidator':
      isValid = updateUserTokensValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in UserTokens entity. ${isValid.error}`
      });
    }
      
    return {
      userId:data.userId,
      token:data.token,
      tokenExpiredTime:data.tokenExpiredTime,
      isTokenExpired:data.isTokenExpired,
      isDeleted:data.isDeleted,
      isActive:data.isActive,
      addedBy:data.addedBy,
    };
  };
}
module.exports =  buildMakeUserTokens;
