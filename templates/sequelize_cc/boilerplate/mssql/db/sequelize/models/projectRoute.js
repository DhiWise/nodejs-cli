const {
  DataTypes, Op 
} = require('sequelize'); 
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const  convertObjectToEnum  = require('../../../utils/convertObjectToEnum');
function makeModel (sequelize){
  const ProjectRoute = sequelize.define('projectRoute',{
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
    let values = Object.assign({}, this.get());
    
    return values;
  };
  sequelizeTransforms(ProjectRoute);
  sequelizePaginate.paginate(ProjectRoute);
  return ProjectRoute;
}
module.exports = makeModel;