const responseCode = require('./responseCode');

module.exports = {

  successResponse: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Your request is successfully executed',
    data: data.data || {},
  }),

  failureResponse: (data, res) => res.status(responseCode.internalServerError).json({
    status: 'FAILURE',
    message: data.message || 'Internal server error.',
    data: data.data || {},
  }),

  badRequest: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || 'The request cannot be fulfilled due to bad syntax.',
    data: data.data || {},
  }),

  validationError: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || `Invalid data, Validation failed.`,
    data: data.data || {},
  }),

  isDuplicate: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || 'Data duplication found.',
    data: data.data || {},
  }),

  recordNotFound: (data, res) => res.status(responseCode.success).json({
    status: 'RECORD_NOT_FOUND',
    message: data.message || 'Record not found with specified criteria.',
    data: data.data || {},
  }),

  insufficientParameters: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || 'Insufficient parameters.',
    data: data.data || {},
  }),

  inValidParam: (data, res) => res.status(responseCode.validationError).json({
    status: 'VALIDATION_ERROR',
    message: data.message || `Invalid values in parameters`,
    data: data.data || {},
  }),

  unAuthorizedRequest: (data, res) => res.status(responseCode.unAuthorizedRequest).json({
    status: 'UNAUTHORIZED',
    message: data.message || 'You are not authorized to access the request.',
    data: data.data || {},
  }),

  loginSuccess: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Login successful.',
    data: data.data || {},
  }),

  loginFailed: (data, res) => res.status(responseCode.badRequest).json({
    status: 'BAD_REQUEST',
    message: data.message || `Login failed.`,
    data: data.data || {},
  }),

  requestValidated: (data, res) => res.status(responseCode.success).json({
    status: 'SUCCESS',
    message: data.message || 'Your request is successfully executed.',
    data: data.data || {},
  }),

  invalidRequest: (data, res) => res.status(responseCode.success).json({
    status: 'FAILURE',
    message: data.message || 'Invalid data, Validation failed.',
    data: data.data || {},
  }),

};
