const roleModel = require('../../../model').role;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/roleValidation');
const insertRoleValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateRoleValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeRole = require('../../../entity/role')({
  insertRoleValidator,
  updateRoleValidator
});
const roleService = require('../../../services/dbService')({
  model:roleModel,
  makeRole
});
const makeRoleController = require('./role');

const roleController = makeRoleController({
  roleService,
  makeRole
});
module.exports = roleController;