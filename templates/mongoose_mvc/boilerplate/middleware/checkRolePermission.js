/**
 * checkRolePermission.js
 * @description :: middleware that checks access of APIs for logged-in user
 */

const mongoose = require('mongoose');
const UserRole = require('../model/userRole');
const RouteRole = require('../model/routeRole');
const ProjectRoute = require('../model/projectRoute');
const { replaceAll } = require('../utils/common');

/**
 * @description : middleware for authentication with role and permission.
 * @param {Object} req : request of route.
 * @param {Object} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const checkRolePermission = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.badRequest();
  }
  const loggedInUserId = req.user.id;
  let rolesOfUser = await UserRole.find({
    userId: loggedInUserId,
    isActive: true,
    isDeleted: false,
  }, {
    roleId: 1,
    _id: 0,
  });
  if (rolesOfUser && rolesOfUser.length) {
    rolesOfUser = rolesOfUser.map((role) => mongoose.Types.ObjectId(role.roleId));
    const route = await ProjectRoute.findOne({
      route_name: replaceAll((req.route.path.toLowerCase()).substring(1), '/', '_'),
      uri: req.route.path.toLowerCase(),
    });
    if (route) {
      const allowedRoute = await RouteRole.find({
        routeId: route._id,
        roleId: { $in: rolesOfUser },
        isActive: true,
        isDeleted: false,
      });
      if (allowedRoute && allowedRoute.length) {
        next();
      } else {
        return res.unAuthorized();
      }
    } else {
      next();
    }
  } else {
    // return res.unAuthorized();
    next();
  }
};

module.exports = checkRolePermission;
