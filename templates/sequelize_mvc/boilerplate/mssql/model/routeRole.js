const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let RouteRole = sequelize.define('routeRole',{
  routeId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  roleId:{ type:DataTypes.INTEGER },
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
      async function (routeRole,options){
        routeRole.isActive = true;
        routeRole.isDeleted = false;
      },
    ],
    beforeBulkCreate: [
      async function (routeRole,options){
        if (routeRole !== undefined && routeRole.length) { 
          for (let index = 0; index < routeRole.length; index++) { 
            const element = routeRole[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
          } 
        }
      },
    ],
  }
}
);
RouteRole.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(RouteRole);
sequelizePaginate.paginate(RouteRole);
module.exports = RouteRole;
