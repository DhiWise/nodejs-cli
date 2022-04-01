let UserToken = require('../db/sequelize/models').userToken;
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
} = require('../db/sequelize/dbService')(UserToken);

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