/**
 * routeRoleRoutes.js
 * @description :: CRUD API routes for routeRole
 */

const express = require('express');
const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRoleController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/routerole/create').post(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.addRouteRole);
router.route('/admin/routerole/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.bulkInsertRouteRole);
router.route('/admin/routerole/list').post(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.findAllRouteRole);
router.route('/admin/routerole/count').post(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.getRouteRoleCount);
router.route('/admin/routerole/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.bulkUpdateRouteRole);
router.route('/admin/routerole/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.softDeleteManyRouteRole);
router.route('/admin/routerole/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.deleteManyRouteRole);
router.route('/admin/routerole/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.softDeleteRouteRole);
router.route('/admin/routerole/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.partialUpdateRouteRole);
router.route('/admin/routerole/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.updateRouteRole);    
router.route('/admin/routerole/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.getRouteRole);
router.route('/admin/routerole/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,routeRoleController.deleteRouteRole);

module.exports = router;
