const dbService = require('./dbService');
const { Op } = require('sequelize');

/*
 * replaceAll: find and replace al; occurrence of a string in a searched string
 * @param string : string to be replace
 * @param search : string which you want to replace
 * @param replace: string with which you want to replace a string
 */
const replaceAll = (string, search, replace) => string.split(search).join(replace); ;

/*
 * convertObjectToEnum : convert object to enum
 * @param obj          : {}
 */
const convertObjectToEnum = (obj) => {
  if (Array.isArray(obj)) {
    return obj;
  }
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(String(val)));
  return enumArr;
};

/*
 * randomNumber : generate random numbers.
 * @param length          : number *default 4
 */
const randomNumber = (length = 4) => {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};
  
/*
 * uniqueValidation: validate Login With Fields while Registration
 * @param Model : Mongoose Model, on which query runs
 * @param data : data , coming from request
 */
const uniqueValidation = async (Model,data) =>{
  let filter = {};
  if (data && data['email']){
    filter = { 'email': data['email'] };
  }
  let found = await dbService.findOne(Model,filter);
  if (found){
    return false;
  }
  return true;
};

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
 * @param model : sequelize models
 * @param userId : Id of user to find role data
 */
const getRoleAccessData = async (model,userId) =>{
  let userRoles = await dbService.findAllRecords(model.userRole, { userId: userId });
  let routeRoles = await dbService.findAllRecords(model.routeRole, { roleId: { [Op.in]: userRoles && userRoles.length ? userRoles.map(u=>u.roleId) : [] } },
    {
      include:[{
        model: model.projectRoute,
        as:'_routeId'
      },{
        model: model.role,
        as: '_roleId'
      }] 
    });
  let models = Object.keys(model);
  let Roles = routeRoles && routeRoles.length ? routeRoles.map(rr => rr._roleId && rr._roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
  let roleAccess = {};
  if (Roles.length){
    Roles.map(role => {
      roleAccess[role] = {};
      models.forEach(model => {
        if (routeRoles && routeRoles.length) {
          routeRoles.map(rr => {
            if (rr._routeId && rr._routeId.uri.includes(model.toLowerCase()) && rr._roleId && rr._roleId.name === role) {
              if (!roleAccess[role][model]) {
                roleAccess[role][model] = [];
              }
              if (rr._routeId.uri.includes('create') && !roleAccess[role][model].includes('C')) {
                roleAccess[role][model].push('C');
              }
              else if (rr._routeId.uri.includes('list') && !roleAccess[role][model].includes('R')) {
                roleAccess[role][model].push('R');
              }
              else if (rr._routeId.uri.includes('update') && !roleAccess[role][model].includes('U')) {
                roleAccess[role][model].push('U');
              }
              else if (rr._routeId.uri.includes('delete') && !roleAccess[role][model].includes('D')) {
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
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
};
