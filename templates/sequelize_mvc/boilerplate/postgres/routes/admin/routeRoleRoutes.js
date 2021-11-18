const express = require('express');
const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRoleController');
const auth = require('../../middleware/auth');
router.route('/admin/routerole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),routeRoleController.addRouteRole);
router.route('/admin/routerole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),routeRoleController.bulkInsertRouteRole);
router.route('/admin/routerole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),routeRoleController.findAllRouteRole);
router.route('/admin/routerole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),routeRoleController.getRouteRole);
router.route('/admin/routerole/:id').post(auth(...[ 'getByAdminInAdminPlatform' ]),routeRoleController.getRouteRole);
router.route('/admin/routerole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),routeRoleController.partialUpdateRouteRole);
router.route('/admin/routerole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),routeRoleController.updateRouteRole);    
router.route('/admin/routerole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),routeRoleController.softDeleteRouteRole);
router.route('/admin/routerole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),routeRoleController.getRouteRoleCount);
router.route('/admin/routerole/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),routeRoleController.upsert);
router.route('/admin/routerole/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),routeRoleController.bulkUpdateRouteRole);

module.exports = router;
