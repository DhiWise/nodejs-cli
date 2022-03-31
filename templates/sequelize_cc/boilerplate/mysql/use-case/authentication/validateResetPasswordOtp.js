const dayjs = require('dayjs');
const response = require('../../utils/response');

const validateResetPasswordOtp = ({ userAuthSettingsDb }) => async (params,req = {},res = {}) => {
  if (!params || !params.otp) {
    return response.badRequest();
  }
  let userAuthSetting = await userAuthSettingsDb.findOne({ resetPasswordCode: params.otp });
  if (!userAuthSetting || !userAuthSetting.expiredTimeOfResetPasswordCode) {
    return response.badRequest({ message : 'Invalid OTP' });
  }
  // link expire
  if (dayjs(new Date()).isAfter(dayjs(userAuthSetting.expiredTimeOfResetPasswordCode))) {
    return response.badRequest({ message:'Your reset password link is expired.' });
  }
  return response.success({ message :'OTP Validated' });
};
module.exports = validateResetPasswordOtp;
