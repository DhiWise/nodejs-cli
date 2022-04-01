module.exports = (projectRoute) => {

  let newProjectRoute = { 
    route_name: projectRoute.route_name,
    method: projectRoute.method,
    uri: projectRoute.uri,
    id: projectRoute.id,
    isActive: projectRoute.isActive,
    createdAt: projectRoute.createdAt,
    updatedAt: projectRoute.updatedAt,
    addedBy: projectRoute.addedBy,
    updatedBy: projectRoute.updatedBy,
    isDeleted: projectRoute.isDeleted,
  };

  // remove undefined values
  if (newProjectRoute.id){
    Object.keys(newProjectRoute).forEach(key =>{
      if (newProjectRoute[key] === undefined) return newProjectRoute[key] = null;
    });
  } else {
    Object.keys(newProjectRoute).forEach(key => newProjectRoute[key] === undefined && delete newProjectRoute[key]);
  }

  // To validate Entity uncomment this block

  /*
   * const validate = (newProjectRoute) => {
   *   if (!newProjectRoute.field) {
   *       throw new Error("this field is required");
   *   }
   * }
   * 
   * validate(newProjectRoute) 
   */
  return Object.freeze(newProjectRoute);
};
