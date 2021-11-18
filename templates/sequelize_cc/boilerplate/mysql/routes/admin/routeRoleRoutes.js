const express = require('express');
const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRole');
const adaptRequest = require('../../helpers/adaptRequest');
const sendResponse = require('../../helpers/sendResponse');
const auth = require('../../middleware/auth');

router.post('/admin/routerole/create',auth(...[ 'createByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.addRouteRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res, result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/routerole/addBulk',auth(...[ 'addBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.bulkInsertRouteRole({
    body: req.body,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/routerole/list',auth(...[ 'getAllByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.findAllRouteRole({
    data: req.body,
    loggedInUser:req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.get('/admin/routerole/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.findRouteRoleByPk(req.pathParams.id).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.post('/admin/routerole/:id',auth(...[ 'getByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.findRouteRoleByPk(req.pathParams.id, req.body).then((result)=>{
    sendResponse(res,result);
  })  
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/routerole/partial-update/:id',auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.partialUpdateRouteRole(req.pathParams.id,req.body,req.user).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.put('/admin/routerole/update/:id',auth(...[ 'updateByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.updateRouteRole(req.pathParams.id,req.body,req.user
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});   
router.put('/admin/routerole/softDelete/:id',auth(...[ 'softDeleteByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.softDeleteRouteRole({
    pk:req.pathParams.id,
    loggedInUser: req.user
  }).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.route('/admin/routerole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.findAllRouteRole({
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
router.post('/admin/routerole/upsert',auth(...[ 'upsertByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.upsertRouteRole(req.body).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
});
router.put('/admin/routerole/updateBulk',auth(...[ 'updateBulkByAdminInAdminPlatform' ]),(req,res,next)=>{
  req = adaptRequest(req);
  routeRoleController.bulkUpdateRouteRole(req.body
  ).then((result)=>{
    sendResponse(res,result);
  })
    .catch((error) => {
      sendResponse(res,error);
    });
}); 

module.exports = router;