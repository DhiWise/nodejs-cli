const schemaValidation = (schema) => (data) => {
  const { error } = schema.validate(data,{
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true };
};

module.exports = schemaValidation;
