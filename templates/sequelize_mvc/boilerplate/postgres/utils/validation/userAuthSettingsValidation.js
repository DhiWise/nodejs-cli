/**
 * userAuthSettingsValidation.js
 * @description :: validate each post and put request as per userAuthSettings model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of userAuthSettings */
exports.schemaKeys = joi.object({
  userId: joi.number().integer().allow(0),
  loginOTP: joi.string().allow(null).allow(''),
  expiredTimeOfLoginOTP: joi.date().options({ convert: true }).allow(null).allow(''),
  resetPasswordCode: joi.string().allow(null).allow(''),
  expiredTimeOfResetPasswordCode: joi.date().options({ convert: true }).allow(null).allow(''),
  loginRetryLimit: joi.number().integer().default(0).allow(0),
  loginReactiveTime: joi.date().options({ convert: true }).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of userAuthSettings for updation */
exports.updateSchemaKeys = joi.object({
  userId: joi.number().integer().allow(0),
  loginOTP: joi.string().allow(null).allow(''),
  expiredTimeOfLoginOTP: joi.date().options({ convert: true }).allow(null).allow(''),
  resetPasswordCode: joi.string().allow(null).allow(''),
  expiredTimeOfResetPasswordCode: joi.date().options({ convert: true }).allow(null).allow(''),
  loginRetryLimit: joi.number().integer().default(0).allow(0),
  loginReactiveTime: joi.date().options({ convert: true }).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of userAuthSettings for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      userId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      loginOTP: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      expiredTimeOfLoginOTP: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      resetPasswordCode: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      expiredTimeOfResetPasswordCode: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      loginRetryLimit: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      loginReactiveTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
