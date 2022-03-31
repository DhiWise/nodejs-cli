let ProjectRoute = require('../db/sequelize/models').projectRoute;
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
} = require('../db/sequelize/dbService')(ProjectRoute);

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