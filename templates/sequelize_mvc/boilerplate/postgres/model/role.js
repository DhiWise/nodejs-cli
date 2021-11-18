const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Role = sequelize.define('role',{
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  code:{
    type:DataTypes.STRING,
    allowNull:false
  },
  weight:{
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
      async function (role,options){
        role.isActive = true;
        role.isDeleted = false;
      },
    ],
    beforeBulkCreate: [
      async function (role,options){
        if (role !== undefined && role.length) { 
          for (let index = 0; index < role.length; index++) { 
            const element = role[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
          } 
        }
      },
    ],
  }
}
);
Role.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Role);
sequelizePaginate.paginate(Role);
module.exports = Role;
