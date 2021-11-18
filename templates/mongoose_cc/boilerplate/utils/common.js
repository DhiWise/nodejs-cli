const mongoose = require('mongoose');
function convertObjectToEnum (obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
};

function randomNumber (length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

function replaceAll (string, search, replace) { return string.split(search).join(replace); };

function makeUniqueValidation (userService) {
  const uniqueValidation = async (data) =>{
    let filter = {};
    if (data && data['email']){
      filter = { 'email': data['email'] };
    }
    let found = await userService.getSingleDocumentByQuery(filter);
    if (found){
      return false;
    }
    return true;
  };
  return Object.freeze({ uniqueValidation });
}

const getDifferenceOfTwoDatesInTime = (currentDate,toDate) =>{
  let hours = toDate.diff(currentDate,'hour');
  currentDate =  currentDate.add(hours, 'hour');
  let minutes = toDate.diff(currentDate,'minute');
  currentDate =  currentDate.add(minutes, 'minute');
  let seconds = toDate.diff(currentDate,'second');
  currentDate =  currentDate.add(seconds, 'second');
  if (hours){
    return `${hours} hour, ${minutes} minute and ${seconds} second`; 
  }
  return `${minutes} minute and ${seconds} second`; 
};
/*
 * getRoleAccessData: return roleAccess of User
 * @param userRoleService : user role db service
 * @param routeRoleService : route role db service
 * @param userId : id of user to find role data
 */
const getRoleAccessData = async (userRoleService,routeRoleService,userId) =>{
  let userRole = await userRoleService.getAllDocuments({ userId: userId },{ pagination:false });
  let routeRole = await routeRoleService.getAllDocuments({ roleId: { $in: userRole.data ? userRole.data.map(u=>u.roleId) : [] } },{
    populate:['roleId','routeId'],
    pagination:false 
  });
  let models = mongoose.modelNames();
  let Roles = routeRole.data ? routeRole.data.map(rr => rr.roleId && rr.roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
  let roleAccess = {};
  if (Roles.length){
    Roles.map(role => {
      roleAccess[role] = {};
      models.forEach(model => {
        if (routeRole.data && routeRole.data.length) {
          routeRole.data.map(rr => {
            if (rr.routeId && rr.routeId.uri.includes(model.toLowerCase()) && rr.roleId && rr.roleId.name === role) {
              if (!roleAccess[role][model]) {
                roleAccess[role][model] = [];
              }
              if (rr.routeId.uri.includes('create') && !roleAccess[role][model].includes('C')) {
                roleAccess[role][model].push('C');
              }
              else if (rr.routeId.uri.includes('list') && !roleAccess[role][model].includes('R')) {
                roleAccess[role][model].push('R');
              }
              else if (rr.routeId.uri.includes('update') && !roleAccess[role][model].includes('U')) {
                roleAccess[role][model].push('U');
              }
              else if (rr.routeId.uri.includes('delete') && !roleAccess[role][model].includes('D')) {
                roleAccess[role][model].push('D');
              }
            }
          });
        }
      });
    });
  }
  return roleAccess;
};

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  makeUniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
};
