let UserRole = require('../db/sequelize/models').userRole;
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
} = require('../db/sequelize/dbService')(UserRole);

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