const response = require('../../utils/response');
const { sendMail } = require('../../services/email');

const sendPasswordByEmail = async (user) => {
  let msg = `Your Password for login : ${user.password}`;
  let mailObj = {
    subject: 'Your Password!',
    to: user.email,
    template: '/views/email/passwordTemplate',
    data: { message:msg }
  };
  try {
    let info = await sendMail(mailObj);
    return response.success({ data :info });
  } catch (error) {
    return response.failure({ data :error });
  }
};
module.exports = sendPasswordByEmail;