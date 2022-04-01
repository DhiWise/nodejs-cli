const {
  DataTypes, Op 
} = require('sequelize'); 
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const  convertObjectToEnum  = require('../../../utils/convertObjectToEnum');
function makeModel (sequelize){
  const UserAuthSettings = sequelize.define('userAuthSettings',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    userId:{ type:DataTypes.INTEGER },
    loginOTP:{ type:DataTypes.STRING },
    expiredTimeOfLoginOTP:{ type:DataTypes.DATE },
    resetPasswordCode:{ type:DataTypes.STRING },
    expiredTimeOfResetPasswordCode:{ type:DataTypes.DATE },
    loginRetryLimit:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    loginReactiveTime:{ type:DataTypes.DATE },
    isActive:{ type:DataTypes.BOOLEAN },
    addedBy:{ type:DataTypes.INTEGER },
    updatedBy:{ type:DataTypes.INTEGER },
    createdAt:{ type:DataTypes.DATE },
    updatedAt:{ type:DataTypes.DATE },
    isDeleted:{ type:DataTypes.BOOLEAN }
  }
  ,{
    hooks:{
      beforeCreate: [
        async function (userAuthSettings,options){
          userAuthSettings.isActive = true;
          userAuthSettings.isDeleted = false;

        },
      ],
      beforeBulkCreate: [
        async function (userAuthSettings,options){
          if (userAuthSettings !== undefined && userAuthSettings.length) { 
            for (let index = 0; index < userAuthSettings.length; index++) { 
        
              const element = userAuthSettings[index]; 
              element.isActive = true; 
              element.isDeleted = false; 
  
            } 
          }
        },
      ],
    } 
  }
  );
  UserAuthSettings.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    
    return values;
  };
  sequelizeTransforms(UserAuthSettings);
  sequelizePaginate.paginate(UserAuthSettings);
  return UserAuthSettings;
}
module.exports = makeModel;