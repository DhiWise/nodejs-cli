const db = require('mongoose');
const roleModel = require('../../../model/role')(db);
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/roleValidation');
const insertRoleValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateRoleValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeRole = require('../../../entity/role')({
  insertRoleValidator,
  updateRoleValidator
});
const roleService = require('../../../services/mongoDbService')({
  model:roleModel,
  makeRole
});
const makeRoleController = require('./role');

const roleController = makeRoleController({
  roleService,
  makeRole
});
module.exports = roleController;
