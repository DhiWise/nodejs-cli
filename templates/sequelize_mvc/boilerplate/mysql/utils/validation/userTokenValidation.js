/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 *
 */

const joi = require('joi');
exports.schemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  userId: joi.number().integer().allow(null).allow(''),
  token: joi.string().allow(null).allow(''),
  tokenExpiredTime: joi.date().allow(null).allow(''),
  isTokenExpired: joi.boolean().default(false).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  userId: joi.number().integer().allow(null).allow(''),
  token: joi.string().allow(null).allow(''),
  tokenExpiredTime: joi.date().allow(null).allow(''),
  isTokenExpired: joi.boolean().default(false).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
