const response = require('../../utils/response');
const sendSMS = require('../../services/sms');

const sendPasswordBySMS = async (user,req = {},res = {}) => {
  let message = `Password for login as`;
  let msg = `${message} : ${user.password}`;
  let smsObj = {
    to: user.mobileNo,
    message: msg
  };
  let result = await sendSMS(smsObj);
  return response.success({ data :result });
};
module.exports = sendPasswordBySMS;