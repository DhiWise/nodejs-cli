const express = require('express');
const router = express.Router();
const userRoleController = require('../../controller/admin/userRoleController');
const auth = require('../../middleware/auth');
router.route('/admin/userrole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),userRoleController.addUserRole);
router.route('/admin/userrole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),userRoleController.bulkInsertUserRole);
router.route('/admin/userrole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),userRoleController.findAllUserRole);
router.route('/admin/userrole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),userRoleController.getUserRole);
router.route('/admin/userrole/:id').post(auth(...[ 'getByAdminInAdminPlatform' ]),userRoleController.getUserRole);
router.route('/admin/userrole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),userRoleController.partialUpdateUserRole);
router.route('/admin/userrole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),userRoleController.updateUserRole);    
router.route('/admin/userrole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),userRoleController.softDeleteUserRole);
router.route('/admin/userrole/aggregate').post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),userRoleController.getUserRoleByAggregate);
router.route('/admin/userrole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),userRoleController.getUserRoleCount);
router.route('/admin/userrole/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),userRoleController.upsert);
router.route('/admin/userrole/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),userRoleController.bulkUpdateUserRole);

module.exports = router;
