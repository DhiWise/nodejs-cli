let ProjectRoute = require('../db/mongoDB/models/projectRoute');
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
} = require('../db/mongoDB/dbService')(ProjectRoute);

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