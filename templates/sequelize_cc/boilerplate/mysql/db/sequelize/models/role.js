const {
  DataTypes, Op 
} = require('sequelize'); 
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const  convertObjectToEnum  = require('../../../utils/convertObjectToEnum');
function makeModel (sequelize){
  const Role = sequelize.define('role',{
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
    let values = Object.assign({}, this.get());
    
    return values;
  };
  sequelizeTransforms(Role);
  sequelizePaginate.paginate(Role);
  return Role;
}
module.exports = makeModel;