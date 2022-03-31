/**
 * userRoleRoutes.js
 * @description :: CRUD API routes for userRole
 */

const express = require('express');
const router = express.Router();
const userRoleController = require('../../controller/admin/userRoleController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/userrole/create').post(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.addUserRole);
router.route('/admin/userrole/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.bulkInsertUserRole);
router.route('/admin/userrole/list').post(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.findAllUserRole);
router.route('/admin/userrole/count').post(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.getUserRoleCount);
router.route('/admin/userrole/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.bulkUpdateUserRole);
router.route('/admin/userrole/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.softDeleteManyUserRole);
router.route('/admin/userrole/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.deleteManyUserRole);
router.route('/admin/userrole/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.softDeleteUserRole);
router.route('/admin/userrole/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.partialUpdateUserRole);
router.route('/admin/userrole/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.updateUserRole);    
router.route('/admin/userrole/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.getUserRole);
router.route('/admin/userrole/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,userRoleController.deleteUserRole);

module.exports = router;
