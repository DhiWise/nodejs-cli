
function buildMakeProjectRoute ({
  insertProjectRouteValidator,updateProjectRouteValidator
}){
  return function makeProjectRoute (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertProjectRouteValidator':
      isValid = insertProjectRouteValidator(data);
      break;

    case 'updateProjectRouteValidator':
      isValid = updateProjectRouteValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in ProjectRoute entity. ${isValid.error}`
      });
    }
      
    return {
      route_name:data.route_name,
      method:data.method,
      uri:data.uri,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
      addedBy:data.addedBy,
    };
  };
}
module.exports =  buildMakeProjectRoute;
