const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let UserToken = sequelize.define('userToken',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  userId:{ type:DataTypes.INTEGER },
  token:{ type:DataTypes.STRING },
  tokenExpiredTime:{ type:DataTypes.DATE },
  isTokenExpired:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (userToken,options){
        userToken.isActive = true;
        userToken.isDeleted = false;
      },
    ],
    beforeBulkCreate: [
      async function (userToken,options){
        if (userToken !== undefined && userToken.length) { 
          for (let index = 0; index < userToken.length; index++) { 
            const element = userToken[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
          } 
        }
      },
    ],
  }
}
);
UserToken.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(UserToken);
sequelizePaginate.paginate(UserToken);
module.exports = UserToken;
