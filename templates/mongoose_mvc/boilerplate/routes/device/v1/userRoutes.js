/**
 * userRoutes.js
 * @description :: CRUD API routes for user
 */

const express = require('express');
const router = express.Router();
const userController = require('../../../controller/device/v1/userController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/device/api/v1/user/me').get(auth(PLATFORM.DEVICE),userController.getLoggedInUserInfo);
router.route('/device/api/v1/user/create').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.addUser);
router.route('/device/api/v1/user/list').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.findAllUser);
router.route('/device/api/v1/user/count').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.getUserCount);
router.route('/device/api/v1/user/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.softDeleteManyUser);
router.route('/device/api/v1/user/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.bulkInsertUser);
router.route('/device/api/v1/user/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.bulkUpdateUser);
router.route('/device/api/v1/user/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,userController.deleteManyUser);
router.route('/device/api/v1/user/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.softDeleteUser);
router.route('/device/api/v1/user/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.partialUpdateUser);
router.route('/device/api/v1/user/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,userController.updateUser);    
router.route('/device/api/v1/user/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,userController.getUser);
router.route('/device/api/v1/user/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,userController.deleteUser);
router.route('/device/api/v1/user/change-password').put(auth(PLATFORM.DEVICE),userController.changePassword);
router.route('/device/api/v1/user/update-profile').put(auth(PLATFORM.DEVICE),userController.updateProfile);

module.exports = router;
