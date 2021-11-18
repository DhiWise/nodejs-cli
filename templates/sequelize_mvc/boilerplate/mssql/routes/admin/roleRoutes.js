const express = require('express');
const router = express.Router();
const roleController = require('../../controller/admin/roleController');
const auth = require('../../middleware/auth');
router.route('/admin/role/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),roleController.addRole);
router.route('/admin/role/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),roleController.bulkInsertRole);
router.route('/admin/role/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),roleController.findAllRole);
router.route('/admin/role/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),roleController.getRole);
router.route('/admin/role/:id').post(auth(...[ 'getByAdminInAdminPlatform' ]),roleController.getRole);
router.route('/admin/role/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),roleController.partialUpdateRole);
router.route('/admin/role/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),roleController.softDeleteRole);
router.route('/admin/role/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),roleController.updateRole);    
router.route('/admin/role/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),roleController.getRoleCount);
router.route('/admin/role/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),roleController.upsert);
router.route('/admin/role/updateBulk').put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),roleController.bulkUpdateRole);

module.exports = router;
