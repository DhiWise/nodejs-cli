const express = require('express');
const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRouteController');
const auth = require('../../middleware/auth');
router.route('/admin/projectroute/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),projectRouteController.addProjectRoute);
router.route('/admin/projectroute/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),projectRouteController.bulkInsertProjectRoute);
router.route('/admin/projectroute/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),projectRouteController.findAllProjectRoute);
router.route('/admin/projectroute/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),projectRouteController.getProjectRoute);
router.route('/admin/projectroute/:id').post(auth(...[ 'getByAdminInAdminPlatform' ]),projectRouteController.getProjectRoute);
router.route('/admin/projectroute/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),projectRouteController.partialUpdateProjectRoute);
router.route('/admin/projectroute/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),projectRouteController.softDeleteProjectRoute);
router.route('/admin/projectroute/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),projectRouteController.updateProjectRoute);    
router.route('/admin/projectroute/aggregate').post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),projectRouteController.getProjectRouteByAggregate);
router.route('/admin/projectroute/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),projectRouteController.getProjectRouteCount);
router.route('/admin/projectroute/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),projectRouteController.upsert);
router.route('/admin/projectroute/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),projectRouteController.bulkUpdateProjectRoute);

module.exports = router;
