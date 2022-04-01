let UserRole = require('../db/mongoDB/models/userRole');
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
} = require('../db/mongoDB/dbService')(UserRole);

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