
const joi = require('joi');
    
exports.schemaKeys = joi.object({
  name: joi.string().required(),
  code: joi.string().required(),
  weight: joi.number().integer().required(),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  name: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  code: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  weight: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  id: joi.number().integer().allow(null).allow('')
}).unknown(true);
