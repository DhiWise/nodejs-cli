const routeRoleModel = require('../../../model').routeRole;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/routeRoleValidation');
const insertRouteRoleValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateRouteRoleValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeRouteRole = require('../../../entity/routeRole')({
  insertRouteRoleValidator,
  updateRouteRoleValidator
});
const routeRoleService = require('../../../services/dbService')({
  model:routeRoleModel,
  makeRouteRole
});
const makeRouteRoleController = require('./routeRole');

const routeRoleController = makeRouteRoleController({
  routeRoleService,
  makeRouteRole
});
module.exports = routeRoleController;