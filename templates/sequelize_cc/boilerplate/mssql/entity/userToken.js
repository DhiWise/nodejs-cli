
function buildMakeUserToken ({
  insertUserTokenValidator,updateUserTokenValidator
}){
  return function makeUserToken (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserTokenValidator':
      isValid = insertUserTokenValidator(data);
      break;

    case 'updateUserTokenValidator':
      isValid = updateUserTokenValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in UserToken entity. ${isValid.error}`
      });
    }
      
    return {
      id:data.id,
      userId:data.userId,
      token:data.token,
      tokenExpiredTime:data.tokenExpiredTime,
      isTokenExpired:data.isTokenExpired,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
    };
  };
}
module.exports =  buildMakeUserToken;
