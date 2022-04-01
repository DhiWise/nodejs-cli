/**
 * projectRouteRoutes.js
 * @description :: CRUD API routes for projectRoute
 */

const express = require('express');
const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRouteController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/projectroute/create').post(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.addProjectRoute);
router.route('/admin/projectroute/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.bulkInsertProjectRoute);
router.route('/admin/projectroute/list').post(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.findAllProjectRoute);
router.route('/admin/projectroute/count').post(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.getProjectRouteCount);
router.route('/admin/projectroute/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.bulkUpdateProjectRoute);
router.route('/admin/projectroute/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.softDeleteManyProjectRoute);
router.route('/admin/projectroute/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.deleteManyProjectRoute);
router.route('/admin/projectroute/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.softDeleteProjectRoute);
router.route('/admin/projectroute/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.partialUpdateProjectRoute);
router.route('/admin/projectroute/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.updateProjectRoute);    
router.route('/admin/projectroute/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.getProjectRoute);
router.route('/admin/projectroute/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,projectRouteController.deleteProjectRoute);

module.exports = router;
