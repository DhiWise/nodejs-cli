/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 *
 */
const joi = require('joi');
exports.schemaKeys = joi.object({
  routeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  roleId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  routeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  roleId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow('')
}).unknown(true);
