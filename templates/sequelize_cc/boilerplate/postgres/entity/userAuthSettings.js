
function buildMakeUserAuthSettings ({
  insertUserAuthSettingsValidator,updateUserAuthSettingsValidator
}){
  return function makeUserAuthSettings (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserAuthSettingsValidator':
      isValid = insertUserAuthSettingsValidator(data);
      break;

    case 'updateUserAuthSettingsValidator':
      isValid = updateUserAuthSettingsValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in UserAuthSettings entity. ${isValid.error}`
      });
    }
      
    return {
      id:data.id,
      userId:data.userId,
      loginOTP:data.loginOTP,
      expiredTimeOfLoginOTP:data.expiredTimeOfLoginOTP,
      resetPasswordCode:data.resetPasswordCode,
      expiredTimeOfResetPasswordCode:data.expiredTimeOfResetPasswordCode,
      loginRetryLimit:data.loginRetryLimit,
      loginReactiveTime:data.loginReactiveTime,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
    };
  };
}
module.exports =  buildMakeUserAuthSettings;
