let Role = require('../db/mongoDB/models/role');
let {
  create,
  createMany,
  updateOne,
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
  aggregate 
} = require('../db/mongoDB/dbService')(Role);

module.exports = {
  create,
  createMany,
  updateOne,
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
  aggregate
};