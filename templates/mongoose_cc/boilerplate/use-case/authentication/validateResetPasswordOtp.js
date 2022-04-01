const dayjs = require('dayjs');
const response = require('../../utils/response');

const validateResetPasswordOtp = ({ userDb }) => async (params) => {
  if (!params || !params.otp) {
    return response.badRequest();
  }
  let user = await userDb.findOne({ 'resetPasswordLink.code': params.otp });
  if (!user || !user.resetPasswordLink.expireTime) {
    return response.badRequest({ message : 'Invalid OTP' });
  }
  // link expire
  if (dayjs(new Date()).isAfter(dayjs(user.resetPasswordLink.expireTime))) {
    return response.badRequest({ message:'Your reset password link is expired.' });
  }
  return response.success({ message :'OTP Validated' });
};
module.exports = validateResetPasswordOtp;