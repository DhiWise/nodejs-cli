/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 *
 */

const joi = require('joi');
exports.schemaKeys = joi.object({
  userId: joi.number().integer().required(),
  roleId: joi.number().integer().required(),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  userId: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  roleId: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
