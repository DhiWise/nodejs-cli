const joi = require('joi');

const { USER_ROLE } = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');   
exports.schemaKeys = joi.object({
  _id: joi.string().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  role: joi.number().integer().valid(...convertObjectToEnum(USER_ROLE)).allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date()
  }).allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  _id: joi.string().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  role: joi.number().integer().valid(...convertObjectToEnum(USER_ROLE)).allow(null).allow(''),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date()
  }).allow(null).allow(''),
  isDeleted: joi.boolean()
}).unknown(true);
