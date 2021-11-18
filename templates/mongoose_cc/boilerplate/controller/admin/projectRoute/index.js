const db = require('mongoose');
const projectRouteModel = require('../../../model/projectRoute')(db);
const {
  schemaKeys,updateSchemaKeys
} = require('../../../validation/projectRouteValidation');
const insertProjectRouteValidator = require('../../../validation/genericValidator')(schemaKeys);
const updateProjectRouteValidator = require('../../../validation/genericValidator')(updateSchemaKeys);
const makeProjectRoute = require('../../../entity/projectRoute')({
  insertProjectRouteValidator,
  updateProjectRouteValidator
});
const projectRouteService = require('../../../services/mongoDbService')({
  model:projectRouteModel,
  makeProjectRoute
});
const makeProjectRouteController = require('./projectRoute');

const projectRouteController = makeProjectRouteController({
  projectRouteService,
  makeProjectRoute
});
module.exports = projectRouteController;
