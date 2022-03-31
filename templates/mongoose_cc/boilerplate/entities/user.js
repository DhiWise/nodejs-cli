module.exports = (user) => {

  let newUser = { 
    username: user.username,
    password: user.password,
    email: user.email,
    name: user.name,
    userType: user.userType,
    isActive: user.isActive,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    addedBy: user.addedBy,
    updatedBy: user.updatedBy,
    mobileNo: user.mobileNo,
    resetPasswordLink: user.resetPasswordLink,
    loginRetryLimit: user.loginRetryLimit,
    loginReactiveTime: user.loginReactiveTime,
  };

  // remove undefined values
  Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key]);

  // To validate Entity uncomment this block

  /*
   * const validate = (newUser) => {
   *   if (!newUser.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newUser) 
   */
  return Object.freeze(newUser);
};
