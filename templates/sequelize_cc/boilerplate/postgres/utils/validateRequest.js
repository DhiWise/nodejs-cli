const joi = require('joi');

exports.validateParamsWithJoi = (body, schemaKeys) => {
  const schema = joi.object(schemaKeys);

  const { error } = schema.validate(body, { abortEarly: false });

  if (error && error.details) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};
exports.validateFilterWithJoi = (payload, schemaKeys, modelSchema) => {
  if (modelSchema && payload.options && payload.options.select && payload.options.select.length > 0) {
    let keys = Object.keys(modelSchema);
    keys.push('id');
    let isValid = keys.some(ai => payload.options.select.includes(ai));
    if (!isValid) {
      return {
        isValid: false,
        message: 'invalid attributes in options.select'
      };
    }
  }
  const { error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};
