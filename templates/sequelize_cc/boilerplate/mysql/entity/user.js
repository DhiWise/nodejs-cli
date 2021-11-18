
function buildMakeUser ({
  insertUserValidator,updateUserValidator
}){
  return function makeUser (data,validatorName){
    let isValid = '';
    switch (validatorName){
    case 'insertUserValidator':
      isValid = insertUserValidator(data);
      break;

    case 'updateUserValidator':
      isValid = updateUserValidator(data);  
      break; 
    }
    if (isValid.error){
      throw ({
        name:'ValidationError',
        message:`Invalid data in User entity. ${isValid.error}`
      });
    }
      
    return {
      id:data.id,
      username:data.username,
      password:data.password,
      email:data.email,
      name:data.name,
      isActive:data.isActive,
      createdAt:data.createdAt,
      updatedAt:data.updatedAt,
      addedBy:data.addedBy,
      updatedBy:data.updatedBy,
      isDeleted:data.isDeleted,
      mobileNo:data.mobileNo,
      role:data.role,
    };
  };
}
module.exports =  buildMakeUser;
