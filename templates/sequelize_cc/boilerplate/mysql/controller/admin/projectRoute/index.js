const projectRouteModel = require('../../../model').projectRoute;
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/projectRouteValidation');
const insertProjectRouteValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateProjectRouteValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeProjectRoute = require('../../../entity/projectRoute')({
  insertProjectRouteValidator,
  updateProjectRouteValidator
});
const projectRouteService = require('../../../services/dbService')({
  model:projectRouteModel,
  makeProjectRoute
});
const makeProjectRouteController = require('./projectRoute');

const projectRouteController = makeProjectRouteController({
  projectRouteService,
  makeProjectRoute
});
module.exports = projectRouteController;