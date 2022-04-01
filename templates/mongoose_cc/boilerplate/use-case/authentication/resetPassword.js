const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const response = require('../../utils/response');
const emailService = require('../../services/email');

const resetPassword = ({ userDb }) => async (params) => {
  if (!params.code || !params.newPassword) {
    return response.badRequest();
  }
  let user = await userDb.findOne({ 'resetPasswordLink.code': params.code });
  //TODO : add condition for guest User

  if (user && user.resetPasswordLink.expireTime) {
    if (dayjs(new Date()).isAfter(dayjs(user.resetPasswordLink.expireTime))) {
      // link expire
      return response.badRequest({ message:'Your reset password link is expired.' });
    }
  } else {
    // invalid code
    return response.badRequest({ message :'Invalid Code' });
  }
  let newPassword = await bcrypt.hash(params.newPassword, 8);
  await userDb.updateOne({ _id : user.id }, {
    'password': newPassword,
    resetPasswordLink: null,
    loginRetryLimit:0
  });
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