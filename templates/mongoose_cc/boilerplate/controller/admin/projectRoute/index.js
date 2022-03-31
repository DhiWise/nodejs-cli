const projectRouteDb = require('../../../data-access/projectRouteDb');
const routeRoleDb = require('../../../data-access/routeRoleDb');

const projectRouteSchema = require('../../../validation/schema/projectRoute');

const createValidation = require('../../../validation')(projectRouteSchema.createSchema);
const updateValidation = require('../../../validation')(projectRouteSchema.updateSchema);
const filterValidation = require('../../../validation')(projectRouteSchema.filterValidationSchema);
const addProjectRouteUsecase = require('../../../use-case/projectRoute/addProjectRoute')({
  projectRouteDb,
  createValidation 
});
const bulkInsertProjectRouteUsecase = require('../../../use-case/projectRoute/bulkInsertProjectRoute')({ projectRouteDb });
const findAllProjectRouteUsecase = require('../../../use-case/projectRoute/findAllProjectRoute')({
  projectRouteDb,
  filterValidation
});
const getProjectRouteCountUsecase = require('../../../use-case/projectRoute/getProjectRouteCount')({
  projectRouteDb,
  filterValidation
});
const bulkUpdateProjectRouteUsecase = require('../../../use-case/projectRoute/bulkUpdateProjectRoute')({ projectRouteDb });
const softDeleteManyProjectRouteUsecase = require('../../../use-case/projectRoute/softDeleteManyProjectRoute')({
  projectRouteDb,
  routeRoleDb
});
const deleteManyProjectRouteUsecase = require('../../../use-case/projectRoute/deleteManyProjectRoute')({
  projectRouteDb,
  routeRoleDb
});
const softDeleteProjectRouteUsecase = require('../../../use-case/projectRoute/softDeleteProjectRoute')({
  projectRouteDb,
  routeRoleDb
});
const partialUpdateProjectRouteUsecase = require('../../../use-case/projectRoute/partialUpdateProjectRoute')({ projectRouteDb });
const updateProjectRouteUsecase = require('../../../use-case/projectRoute/updateProjectRoute')({
  projectRouteDb,
  updateValidation 
});
const getProjectRouteUsecase = require('../../../use-case/projectRoute/getProjectRoute')({
  projectRouteDb,
  filterValidation
});
const deleteProjectRouteUsecase = require('../../../use-case/projectRoute/deleteProjectRoute')({
  projectRouteDb,
  routeRoleDb
});

const projectRouteController = require('./projectRoute');

const addProjectRoute = projectRouteController.addProjectRoute(addProjectRouteUsecase);
const bulkInsertProjectRoute = projectRouteController.bulkInsertProjectRoute(bulkInsertProjectRouteUsecase);
const findAllProjectRoute = projectRouteController.findAllProjectRoute(findAllProjectRouteUsecase);
const getProjectRouteCount = projectRouteController.getProjectRouteCount(getProjectRouteCountUsecase);
const bulkUpdateProjectRoute = projectRouteController.bulkUpdateProjectRoute(bulkUpdateProjectRouteUsecase);
const softDeleteManyProjectRoute = projectRouteController.softDeleteManyProjectRoute(softDeleteManyProjectRouteUsecase);
const deleteManyProjectRoute = projectRouteController.deleteManyProjectRoute(deleteManyProjectRouteUsecase);
const softDeleteProjectRoute = projectRouteController.softDeleteProjectRoute(softDeleteProjectRouteUsecase);
const partialUpdateProjectRoute = projectRouteController.partialUpdateProjectRoute(partialUpdateProjectRouteUsecase);
const updateProjectRoute = projectRouteController.updateProjectRoute(updateProjectRouteUsecase);
const getProjectRouteById = projectRouteController.getProjectRoute(getProjectRouteUsecase);
const deleteProjectRoute = projectRouteController.deleteProjectRoute(deleteProjectRouteUsecase);

module.exports = {
  addProjectRoute,
  bulkInsertProjectRoute,
  findAllProjectRoute,
  getProjectRouteCount,
  bulkUpdateProjectRoute,
  softDeleteManyProjectRoute,
  deleteManyProjectRoute,
  softDeleteProjectRoute,
  partialUpdateProjectRoute,
  updateProjectRoute,
  getProjectRouteById,
  deleteProjectRoute,
};