const express = require('express');
const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRoute');
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const auth = require('../../middleware/auth');

router.post('/admin/projectroute/create',auth(...[ 'createByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.addProjectRoute({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/projectroute/addBulk',auth(...[ 'addBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.bulkInsertProjectRoute({
    body: req.body,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/projectroute/list',auth(...[ 'getAllByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.findAllProjectRoute({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.get('/admin/projectroute/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.findProjectRouteByPk(req.pathParams.id).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/projectroute/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.findProjectRouteByPk(req.pathParams.id, req.body).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/projectroute/partial-update/:id',auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.partialUpdateProjectRoute(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.put('/admin/projectroute/softDelete/:id',auth(...[ 'softDeleteByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.softDeleteProjectRoute({
    pk:req.pathParams.id,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/projectroute/update/:id',auth(...[ 'updateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.updateProjectRoute(req.pathParams.id,req.body,req.user
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.route('/admin/projectroute/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.findAllProjectRoute({
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
router.post('/admin/projectroute/upsert',auth(...[ 'upsertByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.upsertProjectRoute(req.body).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/projectroute/updateBulk',auth(...[ 'updateBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  projectRouteController.bulkUpdateProjectRoute(req.body
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
}); 

module.exports = router;