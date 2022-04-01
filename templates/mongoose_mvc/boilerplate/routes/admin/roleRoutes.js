/**
 * roleRoutes.js
 * @description :: CRUD API routes for role
 */

const express = require('express');
const router = express.Router();
const roleController = require('../../controller/admin/roleController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/role/create').post(auth(PLATFORM.ADMIN),checkRolePermission,roleController.addRole);
router.route('/admin/role/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,roleController.bulkInsertRole);
router.route('/admin/role/list').post(auth(PLATFORM.ADMIN),checkRolePermission,roleController.findAllRole);
router.route('/admin/role/count').post(auth(PLATFORM.ADMIN),checkRolePermission,roleController.getRoleCount);
router.route('/admin/role/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,roleController.bulkUpdateRole);
router.route('/admin/role/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,roleController.softDeleteManyRole);
router.route('/admin/role/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,roleController.deleteManyRole);
router.route('/admin/role/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,roleController.softDeleteRole);
router.route('/admin/role/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,roleController.partialUpdateRole);
router.route('/admin/role/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,roleController.updateRole);    
router.route('/admin/role/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,roleController.getRole);
router.route('/admin/role/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,roleController.deleteRole);

module.exports = router;
