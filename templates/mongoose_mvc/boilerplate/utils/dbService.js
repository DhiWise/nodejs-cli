/*
 * @description : create any mongoose document
 * @param  {Object} model : mongoose model
 * @param  {Object} data : {}
 * @return Promise
 */
const createDocument = (model, data) => new Promise((resolve, reject) => {
  model.create(data, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

/*
 * @description : update any existing mongoose document
 * @param  {Object} model : mongoose model
 * @param {ObjectId} id : mongoose document's _id
 * @param {Object} data : {}
 * @return Promise
 */
const updateDocument = (model, id, data) => new Promise((resolve, reject) => {
  model.updateOne({ _id: id }, data, {
    runValidators: true,
    context: 'query',
  }, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

/*
 * @description : delete any existing mongoose document
 * @param  {Object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @return Promise
 */
const deleteDocument = (model, id) => new Promise((resolve, reject) => {
  model.deleteOne({ _id: id }, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : find all the mongoose document
 * @param  {Object} model : mongoose model
 * @param {Object} query : {}
 * @param {Object} options : {}
 * @return Promise
 */
const getAllDocuments = (model, query, options) => new Promise((resolve, reject) => {
  model.paginate(query, options, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : find single mongoose document
 * @param  {Object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @param  {Array} select : [] *optional
 * @return Promise
 */
const getSingleDocumentById = (model, id, select = []) => new Promise((resolve, reject) => {
  model.findOne({ _id: id }, select, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : find existing mongoose document
 * @param  {Object} model  : mongoose model
 * @params {Object} data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
 * @return Promise
 */
const findExistsData = (model, data) => {
  // let { model } = data;
  const { query } = data;
  const { and } = query;
  const { or } = query;
  const q = {};

  if (and) {
    q.$and = [];
    for (let index = 0; index < and.length; index += 1) {
      q.$and.push(and[index]);
    }
  }
  if (or) {
    q.$or = [];
    for (let index = 0; index < or.length; index += 1) {
      q.$or.push(or[index]);
    }
  }

  return new Promise((resolve, reject) => {
    model.find(q, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

/*
 * @description : soft delete ( partially delete ) mongoose document
 * @param  {Object} model : mongoose model
 * @param  {ObjectId} id : mongoose document's _id
 * @return Promise
 */
const softDeleteDocument = (model, id) => new Promise(async (resolve, reject) => {
  const result = await getSingleDocumentById(model, id);
  result.isDeleted = true;
  model.updateOne({ _id: id }, result, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * bulkInsert     : create document in bulk mongoose document
 * @param  {Object} model  : mongoose model
 * @param  {Object} data   : {}
 * @return Promise
 */
const bulkInsert = (model, data) => new Promise((resolve, reject) => {
  model.insertMany(data, (error, result) => {
    if (result !== undefined && result.length > 0) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

/*
 * @description     : update existing document in bulk mongoose document
 * @param  {Object} model  : mongoose model
 * @param  {Object} filter : {}
 * @param  {Object} data   : {}
 * @return Promise
 */
const bulkUpdate = (model, filter, data) => new Promise((resolve, reject) => {
  model.updateMany(filter, data, (error, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

/*
 * @description : count total number of records in particular model
 * @param  {Object} model : mongoose model
 * @param {Object} where  : {}
 * @return Promise
 */
const countDocument = (model, where) => new Promise((resolve, reject) => {
  model.where(where).countDocuments((error, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(error);
    }
  });
});

/*
 * @description : find document by dynamic query
 * @param  {Object} model : mongoose model
 * @param  {Object} where : {}
 * @param  {Array} select : [] *optional
 */
const getDocumentByQuery = (model, where, select = []) => new Promise((resolve, reject) => {
  model.findOne(where, select, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : find existing document and update mongoose document
 * @param  {Object} model   : mongoose model
 * @param  {Object} filter  : {}
 * @param  {Object} data    : {}
 * @param  {Object} options : {} *optional
 * @return Promise
 */
const findOneAndUpdateDocument = (model, filter, data, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndUpdate(filter, data, options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
});

/*
 * @description : find existing document and delete mongoose document
 * @param  {Object} model  : mongoose model
 * @param  {Object} filter  : {}
 * @param  {Object} options : {} *optional
 * @return Promise
 */
const findOneAndDeleteDocument = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndDelete(filter, options, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : delete multiple document
 * @param  {Object} model  : mongoose model
 * @param  {Object} filter  : {}
 * @param  {Object} options : {} *optional
 * @return Promise
 */
const deleteMany = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.deleteMany(filter, options, (error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

/*
 * @description : get single document with query, populate, and select
 * @param  {obj }model  : mongoose model
 * @param  {Object} filter  : {}
 * @param  {obj }options : {} *optional
 * @return Promise
 */
const getSingleDocument = async (model, filter = {}, options = {}) => {
  let query = model.findOne(filter);
  if (options.select) {
    query = query.select(options.select);
  }
  if (options.populate) {
    query = query.populate(options.populate);
  }
  const result = await query.exec();
  return result;
};

/*
 * @description : find all the mongoose document
 * @param  {Object} model   : mongoose model
 * @param {Object} query    : {}
 * @param {Object} options  : {}
 * @return Promise
 */
const findAllDocuments = (model, filter = {}, options = {}) => new Promise((resolve, reject) => {
  let query = model.find(filter);
  if (options.select) {
    query = query.select(options.select);
  }
  if (options.populate) {
    query = query.populate(options.populate);
  }
  if (options.lean) {
    query = query.lean();
  }
  query.exec((error, data) => {
    if (error) reject(error);
    else resolve(data);
  });
});

module.exports = {
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getSingleDocumentById,
  findExistsData,
  softDeleteDocument,
  bulkInsert,
  bulkUpdate,
  countDocument,
  getDocumentByQuery,
  findOneAndUpdateDocument,
  findOneAndDeleteDocument,
  deleteMany,
  getSingleDocument,
  findAllDocuments,
};
