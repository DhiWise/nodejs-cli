
function buildMakeUser ({
  insertUserValidator,updateUserValidator
}){
  return function makeUser (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserValidator':
      isValid = insertUserValidator(data);
      break;

    case 'updateUserValidator':
      isValid = updateUserValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in User entity. ${isValid.error}`
      });
    }
      
    return {
      username:data.username,
      password:data.password,
      email:data.email,
      name:data.name,
      isActive:data.isActive,
      createdAt:data.createdAt,
      updatedAt:data.updatedAt,
      addedBy:data.addedBy,
      updatedBy:data.updatedBy,
      mobileNo:data.mobileNo,
      isDeleted:data.isDeleted,
      role:data.role,
      resetPasswordLink:data.resetPasswordLink,
      loginRetryLimit:data.loginRetryLimit,
      loginReactiveTime:data.loginReactiveTime,
    };
  };
}
module.exports =  buildMakeUser;
