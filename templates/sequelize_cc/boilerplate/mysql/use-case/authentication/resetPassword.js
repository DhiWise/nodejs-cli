const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const response = require('../../utils/response');
const emailService = require('../../services/email');

const resetPassword = ({
  userDb,userAuthSettingsDb 
}) => async (params) => {
  if (!params.code || !params.newPassword) {
    return response.badRequest();
  }
  let userAuthSetting = await userAuthSettingsDb.findOne({ resetPasswordCode: params.code });
  //TODO : add condition for guest User

  if (userAuthSetting && userAuthSetting.expiredTimeOfResetPasswordCode) {
    if (dayjs(new Date()).isAfter(dayjs(userAuthSetting.expiredTimeOfResetPasswordCode))) {
      // link expire
      return response.badRequest({ message:'Your reset password link is expired.' });
    }
  } else {
    // invalid code
    return response.badRequest({ message :'Invalid Code' });
  }
  let newPassword = await bcrypt.hash(params.newPassword, 8);
  const user = await userDb.updateOne({ id:userAuthSetting.userId },{ 'password': newPassword });
  await userAuthSettingsDb.updateOne({ id : userAuthSetting.id }, { loginRetryLimit:0 });
  let mailObj = {
    subject: 'Reset Password',
    to: user.email,
    template: '/views/email/successfullyResetPassword',
    data: {
      isWidth: true,
      email: user.email || '-',
      message: 'Password Successfully Reset'
    }
  };
  await emailService.sendMail(mailObj);
  return response.success({ message :'Password reset successfully' });
};
module.exports = resetPassword;
