const userRoleModel = require('../../../model').userRole;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/userRoleValidation');
const insertUserRoleValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateUserRoleValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeUserRole = require('../../../entity/userRole')({
  insertUserRoleValidator,
  updateUserRoleValidator
});
const userRoleService = require('../../../services/dbService')({
  model:userRoleModel,
  makeUserRole
});
const makeUserRoleController = require('./userRole');

const userRoleController = makeUserRoleController({
  userRoleService,
  makeUserRole
});
module.exports = userRoleController;