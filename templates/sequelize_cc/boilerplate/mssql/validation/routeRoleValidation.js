
const joi = require('joi');
    
exports.schemaKeys = joi.object({
  routeId: joi.number().integer().required(),
  roleId: joi.number().integer().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  routeId: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  roleId: joi.number().integer().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
