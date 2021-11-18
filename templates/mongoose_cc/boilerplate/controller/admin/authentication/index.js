const db = require('mongoose');
const userModel  = require('../../../model/user')(db);
const userToken = require('../../../model/userTokens')(db);
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/userValidation');
const insertUserValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateUserValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeUser = require('../../../entity/user')({
  insertUserValidator,
  updateUserValidator
});
const userService = require('../../../services/mongoDbService')({
  model:userModel,
  makeUser
});
const userTokenService = require('../../../services/mongoDbService')({ model:userToken });
const userRoleModel  = require('../../../model/userRole')(db);
const userRoleService = require('../../../services/mongoDbService')({ model:userRoleModel });
const routeRoleModel  = require('../../../model/routeRole')(db);
const routeRoleService = require('../../../services/mongoDbService')({ model:routeRoleModel });
const authService = require('../../../services/auth')({
  model:userModel,
  userService,
  userTokenService,
  userRoleService,
  routeRoleService
});
const makeUniqueValidation = require('../../../utils/common.js').makeUniqueValidation(userService);
const makeAuthController = require('./authController');
const authController = makeAuthController({
  authService,
  makeUniqueValidation,
  userService,
  makeUser,
  userTokenService
});
module.exports = authController;