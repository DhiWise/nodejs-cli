module.exports = (role) => {

  let newRole = { 
    name: role.name,
    code: role.code,
    weight: role.weight,
    id: role.id,
    isActive: role.isActive,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    addedBy: role.addedBy,
    updatedBy: role.updatedBy,
    isDeleted: role.isDeleted,
  };

  // remove undefined values
  if (newRole.id){
    Object.keys(newRole).forEach(key =>{
      if (newRole[key] === undefined) return newRole[key] = null;
    });
  } else {
    Object.keys(newRole).forEach(key => newRole[key] === undefined && delete newRole[key]);
  }

  // To validate Entity uncomment this block

  /*
   * const validate = (newRole) => {
   *   if (!newRole.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newRole) 
   */
  return Object.freeze(newRole);
};
