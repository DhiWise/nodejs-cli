const response = require('../../utils/response');

const logout = ({ userTokenDb }) => async (user, token) => {
  let userToken = await userTokenDb.findOne({
    token:token.replace('Bearer ','') ,
    userId:user.id 
  });
  let updatedDocument = { isTokenExpired : true };
  await userTokenDb.updateOne( { id:userToken.id },updatedDocument);
  return response.success({ message:'Logged out Successfully' });
};
module.exports = logout;
