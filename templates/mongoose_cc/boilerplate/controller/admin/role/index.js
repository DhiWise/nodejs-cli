const roleDb = require('../../../data-access/roleDb');
const routeRoleDb = require('../../../data-access/routeRoleDb');
const userRoleDb = require('../../../data-access/userRoleDb');

const roleSchema = require('../../../validation/schema/role');

const createValidation = require('../../../validation')(roleSchema.createSchema);
const updateValidation = require('../../../validation')(roleSchema.updateSchema);
const filterValidation = require('../../../validation')(roleSchema.filterValidationSchema);
const addRoleUsecase = require('../../../use-case/role/addRole')({
  roleDb,
  createValidation 
});
const bulkInsertRoleUsecase = require('../../../use-case/role/bulkInsertRole')({ roleDb });
const findAllRoleUsecase = require('../../../use-case/role/findAllRole')({
  roleDb,
  filterValidation
});
const getRoleCountUsecase = require('../../../use-case/role/getRoleCount')({
  roleDb,
  filterValidation
});
const bulkUpdateRoleUsecase = require('../../../use-case/role/bulkUpdateRole')({ roleDb });
const softDeleteManyRoleUsecase = require('../../../use-case/role/softDeleteManyRole')({
  roleDb,
  routeRoleDb,
  userRoleDb
});
const deleteManyRoleUsecase = require('../../../use-case/role/deleteManyRole')({
  roleDb,
  routeRoleDb,
  userRoleDb
});
const softDeleteRoleUsecase = require('../../../use-case/role/softDeleteRole')({
  roleDb,
  routeRoleDb,
  userRoleDb
});
const partialUpdateRoleUsecase = require('../../../use-case/role/partialUpdateRole')({ roleDb });
const updateRoleUsecase = require('../../../use-case/role/updateRole')({
  roleDb,
  updateValidation 
});
const getRoleUsecase = require('../../../use-case/role/getRole')({
  roleDb,
  filterValidation
});
const deleteRoleUsecase = require('../../../use-case/role/deleteRole')({
  roleDb,
  routeRoleDb,
  userRoleDb
});

const roleController = require('./role');

const addRole = roleController.addRole(addRoleUsecase);
const bulkInsertRole = roleController.bulkInsertRole(bulkInsertRoleUsecase);
const findAllRole = roleController.findAllRole(findAllRoleUsecase);
const getRoleCount = roleController.getRoleCount(getRoleCountUsecase);
const bulkUpdateRole = roleController.bulkUpdateRole(bulkUpdateRoleUsecase);
const softDeleteManyRole = roleController.softDeleteManyRole(softDeleteManyRoleUsecase);
const deleteManyRole = roleController.deleteManyRole(deleteManyRoleUsecase);
const softDeleteRole = roleController.softDeleteRole(softDeleteRoleUsecase);
const partialUpdateRole = roleController.partialUpdateRole(partialUpdateRoleUsecase);
const updateRole = roleController.updateRole(updateRoleUsecase);
const getRoleById = roleController.getRole(getRoleUsecase);
const deleteRole = roleController.deleteRole(deleteRoleUsecase);

module.exports = {
  addRole,
  bulkInsertRole,
  findAllRole,
  getRoleCount,
  bulkUpdateRole,
  softDeleteManyRole,
  deleteManyRole,
  softDeleteRole,
  partialUpdateRole,
  updateRole,
  getRoleById,
  deleteRole,
};