const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('../commonFilterValidation');

const createSchema = joi.object({
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

const updateSchema = joi.object({
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
let filterValidationSchema = joi.object({
  options: options,
  ...Object.fromEntries(keys.map(key => [key, joi.object({
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
  }).unknown(true),])),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
}).unknown(true);

module.exports = {
  createSchema,
  updateSchema,
  filterValidationSchema
};