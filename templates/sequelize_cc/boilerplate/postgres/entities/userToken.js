module.exports = (userToken) => {

  let newUserToken = { 
    id: userToken.id,
    userId: userToken.userId,
    token: userToken.token,
    tokenExpiredTime: userToken.tokenExpiredTime,
    isTokenExpired: userToken.isTokenExpired,
    isActive: userToken.isActive,
    addedBy: userToken.addedBy,
    updatedBy: userToken.updatedBy,
    createdAt: userToken.createdAt,
    updatedAt: userToken.updatedAt,
    isDeleted: userToken.isDeleted,
  };

  // remove undefined values
  if (newUserToken.id){
    Object.keys(newUserToken).forEach(key =>{
      if (newUserToken[key] === undefined) return newUserToken[key] = null;
    });
  } else {
    Object.keys(newUserToken).forEach(key => newUserToken[key] === undefined && delete newUserToken[key]);
  }

  // To validate Entity uncomment this block

  /*
   * const validate = (newUserToken) => {
   *   if (!newUserToken.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newUserToken) 
   */
  return Object.freeze(newUserToken);
};
