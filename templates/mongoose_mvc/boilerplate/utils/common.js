/**
 * common.js
 * @description: exports helper methods for project.
 */

const mongoose = require('mongoose');
const UserRole = require('../model/userRole');
const RouteRole = require('../model/routeRole');
const dbService = require('./dbService');

/**
 * convertObjectToEnum : converts object to enum
 * @param {Object} obj : object to be converted
 * @return {Array} : converted Array
 */
function convertObjectToEnum (obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
}

/**
 * randomNumber : generate random numbers for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random number
 */
function randomNumber (length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

/**
 * replaceAll: find and replace all occurrence of a string in a searched string
 * @param {string} string  : string to be replace
 * @param {string} search  : string which you want to replace
 * @param {string} replace : string with which you want to replace a string
 * @return {string} : replaced new string
 */
function replaceAll (string, search, replace) { 
  return string.split(search).join(replace); 
}

/**
 * uniqueValidation: check unique validation while user registration
 * @param {Object} model : mongoose model instance of collection
 * @param {Object} data : data, coming from request
 * @return {boolean} : validation status
 */
async function uniqueValidation (Model,data){
  let filter = {};
    
  if (data && data['username'] ){
    filter = { 'username': data['username'] };
  }
    
  filter.isActive = true;
  filter.isDeleted = false;
  let found = await dbService.getDocumentByQuery(Model,filter);
  if (found){
    return false;
  }
  return true;
}

/**
 * getDifferenceOfTwoDatesInTime : get difference between two dates in time
 * @param {date} currentDate  : current date
 * @param {date} toDate  : future date
 * @return {string} : difference of two date in time
 */
function getDifferenceOfTwoDatesInTime (currentDate,toDate){
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
}

/** 
 * getRoleAccessData: returns role access of User
 * @param {objectId} userId : id of user to find role data
 * @return {Object} : role access for APIs of model
 */
async function getRoleAccessData (userId) {
  let userRole = await dbService.getAllDocuments(UserRole, { userId: userId },{ pagination:false });
  let routeRole = await dbService.getAllDocuments(RouteRole, { roleId: { $in: userRole.data ? userRole.data.map(u=>u.roleId) : [] } },{
    pagination:false,
    populate:['roleId','routeId'] 
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
            if (rr.routeId && rr.routeId.uri.includes(`/${model.toLowerCase()}/`) && rr.roleId && rr.roleId.name === role) {
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
}

/**
 * getSelectObject : to return a object of select from string, array
 * @param {string || array || object} select : selection attributes
 * @returns {object} : object of select to be passed with filter
 */
function getSelectObject (select) {
  let selectArray = [];
  if (typeof select === 'string'){
    selectArray = select.split(' ');
  } else if (Array.isArray(select)){
    selectArray = select;
  } else if (typeof select === 'object'){
    return select;
  }
  let selectObject = {};
  if (selectArray.length){
    for (let index = 0; index < selectArray.length; index += 1) {
      const element = selectArray[index];
      if (element.startsWith('-')){
        Object.assign(selectObject, { [element.substring(1)]: -1 });
      } else {
        Object.assign(selectObject, { [element]: 1 });
      }
    }
  }
  return selectObject;
}

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
  getSelectObject,
};
