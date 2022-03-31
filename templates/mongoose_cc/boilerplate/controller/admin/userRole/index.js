const userRoleDb = require('../../../data-access/userRoleDb');

const userRoleSchema = require('../../../validation/schema/userRole');

const createValidation = require('../../../validation')(userRoleSchema.createSchema);
const updateValidation = require('../../../validation')(userRoleSchema.updateSchema);
const filterValidation = require('../../../validation')(userRoleSchema.filterValidationSchema);
const addUserRoleUsecase = require('../../../use-case/userRole/addUserRole')({
  userRoleDb,
  createValidation 
});
const bulkInsertUserRoleUsecase = require('../../../use-case/userRole/bulkInsertUserRole')({ userRoleDb });
const findAllUserRoleUsecase = require('../../../use-case/userRole/findAllUserRole')({
  userRoleDb,
  filterValidation
});
const getUserRoleCountUsecase = require('../../../use-case/userRole/getUserRoleCount')({
  userRoleDb,
  filterValidation
});
const bulkUpdateUserRoleUsecase = require('../../../use-case/userRole/bulkUpdateUserRole')({ userRoleDb });
const softDeleteManyUserRoleUsecase = require('../../../use-case/userRole/softDeleteManyUserRole')({ userRoleDb });
const deleteManyUserRoleUsecase = require('../../../use-case/userRole/deleteManyUserRole')({ userRoleDb });
const softDeleteUserRoleUsecase = require('../../../use-case/userRole/softDeleteUserRole')({ userRoleDb });
const partialUpdateUserRoleUsecase = require('../../../use-case/userRole/partialUpdateUserRole')({ userRoleDb });
const updateUserRoleUsecase = require('../../../use-case/userRole/updateUserRole')({
  userRoleDb,
  updateValidation 
});
const getUserRoleUsecase = require('../../../use-case/userRole/getUserRole')({
  userRoleDb,
  filterValidation
});
const deleteUserRoleUsecase = require('../../../use-case/userRole/deleteUserRole')({ userRoleDb });

const userRoleController = require('./userRole');

const addUserRole = userRoleController.addUserRole(addUserRoleUsecase);
const bulkInsertUserRole = userRoleController.bulkInsertUserRole(bulkInsertUserRoleUsecase);
const findAllUserRole = userRoleController.findAllUserRole(findAllUserRoleUsecase);
const getUserRoleCount = userRoleController.getUserRoleCount(getUserRoleCountUsecase);
const bulkUpdateUserRole = userRoleController.bulkUpdateUserRole(bulkUpdateUserRoleUsecase);
const softDeleteManyUserRole = userRoleController.softDeleteManyUserRole(softDeleteManyUserRoleUsecase);
const deleteManyUserRole = userRoleController.deleteManyUserRole(deleteManyUserRoleUsecase);
const softDeleteUserRole = userRoleController.softDeleteUserRole(softDeleteUserRoleUsecase);
const partialUpdateUserRole = userRoleController.partialUpdateUserRole(partialUpdateUserRoleUsecase);
const updateUserRole = userRoleController.updateUserRole(updateUserRoleUsecase);
const getUserRoleById = userRoleController.getUserRole(getUserRoleUsecase);
const deleteUserRole = userRoleController.deleteUserRole(deleteUserRoleUsecase);

module.exports = {
  addUserRole,
  bulkInsertUserRole,
  findAllUserRole,
  getUserRoleCount,
  bulkUpdateUserRole,
  softDeleteManyUserRole,
  deleteManyUserRole,
  softDeleteUserRole,
  partialUpdateUserRole,
  updateUserRole,
  getUserRoleById,
  deleteUserRole,
};