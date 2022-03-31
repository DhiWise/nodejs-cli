module.exports = (projectRoute) => {

  let newProjectRoute = { 
    route_name: projectRoute.route_name,
    method: projectRoute.method,
    uri: projectRoute.uri,
    isActive: projectRoute.isActive,
    createdAt: projectRoute.createdAt,
    updatedAt: projectRoute.updatedAt,
    addedBy: projectRoute.addedBy,
    updatedBy: projectRoute.updatedBy,
    isDeleted: projectRoute.isDeleted,
  };

  // remove undefined values
  Object.keys(newProjectRoute).forEach(key => newProjectRoute[key] === undefined && delete newProjectRoute[key]);

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
