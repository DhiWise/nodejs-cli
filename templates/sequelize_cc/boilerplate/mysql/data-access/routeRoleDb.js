let RouteRole = require('../db/sequelize/models').routeRole;
let {
  create,
  createMany,
  updateOne,
  updateByQuery,
  updateMany,
  deleteOne,
  deleteMany,
  softDelete,
  softDeleteMany,
  findOne,
  findMany,
  paginate,
  count,    
  upsert,
} = require('../db/sequelize/dbService')(RouteRole);

module.exports = {
  create,
  createMany,
  updateOne,
  updateByQuery,
  updateMany,
  deleteOne,
  deleteMany,
  softDelete,
  softDeleteMany,
  findOne,
  findMany,
  paginate,
  count,
  upsert,    
};