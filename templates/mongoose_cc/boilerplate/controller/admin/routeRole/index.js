const routeRoleDb = require('../../../data-access/routeRoleDb');

const routeRoleSchema = require('../../../validation/schema/routeRole');

const createValidation = require('../../../validation')(routeRoleSchema.createSchema);
const updateValidation = require('../../../validation')(routeRoleSchema.updateSchema);
const filterValidation = require('../../../validation')(routeRoleSchema.filterValidationSchema);
const addRouteRoleUsecase = require('../../../use-case/routeRole/addRouteRole')({
  routeRoleDb,
  createValidation 
});
const bulkInsertRouteRoleUsecase = require('../../../use-case/routeRole/bulkInsertRouteRole')({ routeRoleDb });
const findAllRouteRoleUsecase = require('../../../use-case/routeRole/findAllRouteRole')({
  routeRoleDb,
  filterValidation
});
const getRouteRoleCountUsecase = require('../../../use-case/routeRole/getRouteRoleCount')({
  routeRoleDb,
  filterValidation
});
const bulkUpdateRouteRoleUsecase = require('../../../use-case/routeRole/bulkUpdateRouteRole')({ routeRoleDb });
const softDeleteManyRouteRoleUsecase = require('../../../use-case/routeRole/softDeleteManyRouteRole')({ routeRoleDb });
const deleteManyRouteRoleUsecase = require('../../../use-case/routeRole/deleteManyRouteRole')({ routeRoleDb });
const softDeleteRouteRoleUsecase = require('../../../use-case/routeRole/softDeleteRouteRole')({ routeRoleDb });
const partialUpdateRouteRoleUsecase = require('../../../use-case/routeRole/partialUpdateRouteRole')({ routeRoleDb });
const updateRouteRoleUsecase = require('../../../use-case/routeRole/updateRouteRole')({
  routeRoleDb,
  updateValidation 
});
const getRouteRoleUsecase = require('../../../use-case/routeRole/getRouteRole')({
  routeRoleDb,
  filterValidation
});
const deleteRouteRoleUsecase = require('../../../use-case/routeRole/deleteRouteRole')({ routeRoleDb });

const routeRoleController = require('./routeRole');

const addRouteRole = routeRoleController.addRouteRole(addRouteRoleUsecase);
const bulkInsertRouteRole = routeRoleController.bulkInsertRouteRole(bulkInsertRouteRoleUsecase);
const findAllRouteRole = routeRoleController.findAllRouteRole(findAllRouteRoleUsecase);
const getRouteRoleCount = routeRoleController.getRouteRoleCount(getRouteRoleCountUsecase);
const bulkUpdateRouteRole = routeRoleController.bulkUpdateRouteRole(bulkUpdateRouteRoleUsecase);
const softDeleteManyRouteRole = routeRoleController.softDeleteManyRouteRole(softDeleteManyRouteRoleUsecase);
const deleteManyRouteRole = routeRoleController.deleteManyRouteRole(deleteManyRouteRoleUsecase);
const softDeleteRouteRole = routeRoleController.softDeleteRouteRole(softDeleteRouteRoleUsecase);
const partialUpdateRouteRole = routeRoleController.partialUpdateRouteRole(partialUpdateRouteRoleUsecase);
const updateRouteRole = routeRoleController.updateRouteRole(updateRouteRoleUsecase);
const getRouteRoleById = routeRoleController.getRouteRole(getRouteRoleUsecase);
const deleteRouteRole = routeRoleController.deleteRouteRole(deleteRouteRoleUsecase);

module.exports = {
  addRouteRole,
  bulkInsertRouteRole,
  findAllRouteRole,
  getRouteRoleCount,
  bulkUpdateRouteRole,
  softDeleteManyRouteRole,
  deleteManyRouteRole,
  softDeleteRouteRole,
  partialUpdateRouteRole,
  updateRouteRole,
  getRouteRoleById,
  deleteRouteRole,
};