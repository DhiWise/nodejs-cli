const express = require('express');
const router = express.Router();
const roleController = require('../../controller/admin/role');
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const auth = require('../../middleware/auth');

router.post('/admin/role/create',auth(...[ 'createByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.addRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/role/addBulk',auth(...[ 'addBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.bulkInsertRole({
    body: req.body,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/role/list',auth(...[ 'getAllByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.findAllRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.get('/admin/role/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.findRoleByPk(req.pathParams.id).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/role/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.findRoleByPk(req.pathParams.id, req.body).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/role/partial-update/:id',auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.partialUpdateRole(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.put('/admin/role/softDelete/:id',auth(...[ 'softDeleteByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.softDeleteRole({
    pk:req.pathParams.id,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/role/update/:id',auth(...[ 'updateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.updateRole(req.pathParams.id,req.body,req.user
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.route('/admin/role/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.findAllRole({
    data:{
      query: { ...req.body },
      isCountOnly:true 
    } 
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/role/upsert',auth(...[ 'upsertByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.upsertRole(req.body).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/role/updateBulk',auth(...[ 'updateBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  roleController.bulkUpdateRole(req.body
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
}); 

module.exports = router;