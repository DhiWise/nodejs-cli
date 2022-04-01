module.exports = (userRole) => {

  let newUserRole = { 
    userId: userRole.userId,
    roleId: userRole.roleId,
    id: userRole.id,
    isActive: userRole.isActive,
    createdAt: userRole.createdAt,
    updatedAt: userRole.updatedAt,
    addedBy: userRole.addedBy,
    updatedBy: userRole.updatedBy,
    isDeleted: userRole.isDeleted,
  };

  // remove undefined values
  if (newUserRole.id){
    Object.keys(newUserRole).forEach(key =>{
      if (newUserRole[key] === undefined) return newUserRole[key] = null;
    });
  } else {
    Object.keys(newUserRole).forEach(key => newUserRole[key] === undefined && delete newUserRole[key]);
  }

  // To validate Entity uncomment this block

  /*
   * const validate = (newUserRole) => {
   *   if (!newUserRole.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newUserRole) 
   */
  return Object.freeze(newUserRole);
};
