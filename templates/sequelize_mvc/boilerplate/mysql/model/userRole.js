/**
 * userRole.js
 * @description :: sequelize model of database table userRole
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let UserRole = sequelize.define('userRole',{
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  roleId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  addedBy:{ type:DataTypes.INTEGER },
  updatedBy:{ type:DataTypes.INTEGER },
  isDeleted:{ type:DataTypes.BOOLEAN }
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
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(UserRole);
sequelizePaginate.paginate(UserRole);
module.exports = UserRole;
