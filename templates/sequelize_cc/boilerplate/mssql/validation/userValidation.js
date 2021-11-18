
const joi = require('joi');
const { USER_ROLE } = require('../constants/authConstant');
const { convertObjectToEnum } = require('../utils/common');   
    
exports.schemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow('')
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  id: joi.number().integer().allow(null).allow(''),
  username: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  name: joi.string().allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow('')
}).unknown(true);
