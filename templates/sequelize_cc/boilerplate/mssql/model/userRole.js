const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
function makeModel (sequelize){
  const UserRole = sequelize.define('userRole',{
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    roleId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    isActive:{ type:DataTypes.BOOLEAN },
    isDeleted:{ type:DataTypes.BOOLEAN },
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    }
  }
  ,{
    hooks:{
      beforeCreate: [
        async function (userRole,options){
          userRole.isActive = true;
          userRole.isDeleted = false;
        },
      ],
      beforeBulkCreate: [
        async function (userRole,options){
          if (userRole !== undefined && userRole.length) { 
            for (let index = 0; index < userRole.length; index++) { 
              const element = userRole[index]; 
              element.isActive = true; 
              element.isDeleted = false; 
            } 
          }
        },
      ],
    } 
  }
  );
  UserRole.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());
    
    return values;
  };
  sequelizeTransforms(UserRole);
  sequelizePaginate.paginate(UserRole);
  return UserRole;
}
module.exports = makeModel;