
function buildMakeUserRole ({
  insertUserRoleValidator,updateUserRoleValidator
}){
  return function makeUserRole (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserRoleValidator':
      isValid = insertUserRoleValidator(data);
      break;

    case 'updateUserRoleValidator':
      isValid = updateUserRoleValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in UserRole entity. ${isValid.error}`
      });
    }
      
    return {
      userId:data.userId,
      roleId:data.roleId,
      isActive:data.isActive,
      isDeleted:data.isDeleted,
      addedBy:data.addedBy,
    };
  };
}
module.exports =  buildMakeUserRole;
