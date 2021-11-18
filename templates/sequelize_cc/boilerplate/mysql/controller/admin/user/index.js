const userModel = require('../../../model').user;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/userValidation');
const insertUserValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateUserValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeUser = require('../../../entity/user')({
  insertUserValidator,
  updateUserValidator
});
const userService = require('../../../services/dbService')({
  model:userModel,
  makeUser
});
const makeUserController = require('./user');

const authService = require('../../../services/auth')({
  model:userModel,
  userService
});
const userController = makeUserController({
  userService,
  makeUser,
  authService
});
module.exports = userController;