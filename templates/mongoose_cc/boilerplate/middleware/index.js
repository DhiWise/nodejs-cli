const passport = require('passport');
let userDb = require('../data-access/userDb');
let userTokensDb = require('../data-access/userTokensDb');
let userRoleDb = require('../data-access/userRoleDb');
let routeRoleDb = require('../data-access/routeRoleDb');
let projectRouteDb = require('../data-access/projectRouteDb');

const auth = require('./auth')({
  passport,
  userTokensDb 
});
const checkRolePermission = require('./checkRolePermission')({
  userRoleDb,
  routeRoleDb,
  projectRouteDb
});

const devicePassportStrategy = require('./devicePassportStrategy')({ userDb });
const adminPassportStrategy = require('./adminPassportStrategy')({ userDb });

module.exports = {
  auth,
  checkRolePermission,
  devicePassportStrategy,
  adminPassportStrategy,
};