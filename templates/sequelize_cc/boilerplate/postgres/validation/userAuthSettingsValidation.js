
const joi = require('joi');
    
exports.schemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  userId: joi.number().integer().allow(null).allow(''),
  loginOTP: joi.string().allow(null).allow(''),
  expiredTimeOfLoginOTP: joi.date().allow(null).allow(''),
  resetPasswordCode: joi.string().allow(null).allow(''),
  expiredTimeOfResetPasswordCode: joi.date().allow(null).allow(''),
  loginRetryLimit: joi.number().integer().default(0).allow(null).allow(''),
  loginReactiveTime: joi.date().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  userId: joi.number().integer().allow(null).allow(''),
  loginOTP: joi.string().allow(null).allow(''),
  expiredTimeOfLoginOTP: joi.date().allow(null).allow(''),
  resetPasswordCode: joi.string().allow(null).allow(''),
  expiredTimeOfResetPasswordCode: joi.date().allow(null).allow(''),
  loginRetryLimit: joi.number().integer().default(0).allow(null).allow(''),
  loginReactiveTime: joi.date().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
