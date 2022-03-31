let UserAuthSettings = require('../db/sequelize/models').userAuthSettings;
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
} = require('../db/sequelize/dbService')(UserAuthSettings);

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