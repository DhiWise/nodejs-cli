const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let ProjectRoute = sequelize.define('projectRoute',{
  route_name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  method:{
    type:DataTypes.STRING,
    allowNull:false
  },
  uri:{
    type:DataTypes.STRING,
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
      async function (projectRoute,options){
        projectRoute.isActive = true;
        projectRoute.isDeleted = false;
      },
    ],
    beforeBulkCreate: [
      async function (projectRoute,options){
        if (projectRoute !== undefined && projectRoute.length) { 
          for (let index = 0; index < projectRoute.length; index++) { 
            const element = projectRoute[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
          } 
        }
      },
    ],
  }
}
);
ProjectRoute.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(ProjectRoute);
sequelizePaginate.paginate(ProjectRoute);
module.exports = ProjectRoute;
