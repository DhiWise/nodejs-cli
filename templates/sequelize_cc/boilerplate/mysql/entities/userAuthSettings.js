module.exports = (userAuthSettings) => {

  let newUserAuthSettings = { 
    id: userAuthSettings.id,
    userId: userAuthSettings.userId,
    loginOTP: userAuthSettings.loginOTP,
    expiredTimeOfLoginOTP: userAuthSettings.expiredTimeOfLoginOTP,
    resetPasswordCode: userAuthSettings.resetPasswordCode,
    expiredTimeOfResetPasswordCode: userAuthSettings.expiredTimeOfResetPasswordCode,
    loginRetryLimit: userAuthSettings.loginRetryLimit,
    loginReactiveTime: userAuthSettings.loginReactiveTime,
    isActive: userAuthSettings.isActive,
    addedBy: userAuthSettings.addedBy,
    updatedBy: userAuthSettings.updatedBy,
    createdAt: userAuthSettings.createdAt,
    updatedAt: userAuthSettings.updatedAt,
    isDeleted: userAuthSettings.isDeleted,
  };

  // remove undefined values
  if (newUserAuthSettings.id){
    Object.keys(newUserAuthSettings).forEach(key =>{
      if (newUserAuthSettings[key] === undefined) return newUserAuthSettings[key] = null;
    });
  } else {
    Object.keys(newUserAuthSettings).forEach(key => newUserAuthSettings[key] === undefined && delete newUserAuthSettings[key]);
  }

  // To validate Entity uncomment this block

  /*
   * const validate = (newUserAuthSettings) => {
   *   if (!newUserAuthSettings.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newUserAuthSettings) 
   */
  return Object.freeze(newUserAuthSettings);
};
