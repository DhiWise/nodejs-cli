/*
 * createDocument : create any mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const createDocument = (model, data) => new Promise((resolve, reject) => {
  model.create(data, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * updateDocument : update any existing mongoose document
 * @param  model  : mongoose model
 * @param id      : mongoose document's _id
 * @param data    : {}
 */
const updateDocument = (model, id, data) => new Promise((resolve, reject) => {
  model.updateOne({ _id: id }, data, {
    runValidators: true,
    context: 'query',
  }, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * deleteDocument : delete any existing mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 */
const deleteDocument = (model, id) => new Promise((resolve, reject) => {
  model.deleteOne({ _id: id }, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * getAllDocuments : find all the mongoose document
 * @param  model   : mongoose model
 * @param query    : {}
 * @param options  : {}
 */
const getAllDocuments = (model, query, options) => new Promise((resolve, reject) => {
  model.paginate(query, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * getSingleDocumentById : find single mongoose document
 * @param  model  : mongoose model
 * @param  id     : mongoose document's _id
 * @param  select : [] *optional
 */
const getSingleDocumentById = (model, id, select = []) => new Promise((resolve, reject) => {
  model.findOne({ _id: id }, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * findExistsData : find existing mongoose document
 * @param  model  : mongoose model
 * @params data   : {
 *                   "query":{
 *                       "and":[{"Name":"Dhiraj"},{"Salary":300}],
 *                        "or":[{"Name":"Dhiraj"},{"Salary":300}]
 *                   }
 * }
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
    model.find(q, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
/*
 * getDocumentByAggregation : find mongoose document by aggregation
 * @param  model  : mongoose model
 * @param  query : {}
 */
const getDocumentByAggregation = (model, query) => {
  let keyInJson; let
    valuesOfAggregate;
  let valuesOfFields; let
    keysOfFields;
  let input = {}; let finalInput = {}; let
    aggregate = {};
  const array = [];
  for (const [keys, values] of Object.entries(query)) {
    for (const [key, value] of Object.entries(values)) {
      switch (keys) {
      case 'group':
        keyInJson = 'key' in value;
        if (keyInJson) {
          valuesOfAggregate = Object.values(value);
          valuesOfFields = Object.values(valuesOfAggregate[0]);
          keysOfFields = Object.keys(valuesOfAggregate[0]);
          for (const [nestKey, nestValue] of Object.entries(valuesOfFields)) {
            if (Array.isArray(nestValue)) {
              input._id = `$${keysOfFields[nestKey]}`;
              for (const [i, j] of Object.entries(nestValue)) {
                finalInput[`$${key}`] = '';
                finalInput[`$${key}`] += `$${j}`;
                input[j] = finalInput;
                finalInput = {};
              }
              aggregate.$group = input;
              array.push(aggregate);
            } else {
              input._id = `$${keysOfFields[nestKey]}`;
              finalInput[`$${key}`] = '';
              finalInput[`$${key}`] = `$${nestValue}`;
              input[nestValue] = finalInput;
              aggregate.$group = input;
              array.push(aggregate);
            }
          }
        }
        aggregate = {};
        finalInput = {};
        input = {};
        break;

      case 'match':
        valuesOfFields = Object.values(value).flat();
        keysOfFields = Object.keys(value);
        if (Array.isArray(valuesOfFields) && valuesOfFields.length > 1) {
          finalInput.$in = valuesOfFields;
          input[keysOfFields[0]] = finalInput;
        } else {
          input[keysOfFields[0]] = valuesOfFields[0];
        }
        aggregate.$match = input;
        array.push(aggregate);
        aggregate = {};
        input = {};
        finalInput = {};
        break;

      case 'project':
        valuesOfFields = Object.values(value);
        if (valuesOfFields.length === 1) {
          const projectValues = Object.values(valuesOfFields[0]).toString();
          const projectKeys = Object.keys(valuesOfFields[0]).toString();
          const projectArr = [];

          if (isNaN(projectValues)) {
            projectArr.push(`$${projectKeys}`);
            projectArr.push(`$${projectValues}`);
          } else {
            projectArr.push(`$${projectKeys}`);
            projectArr.push(projectValues);
          }
          finalInput[`$${key}`] = projectArr;
          input[projectKeys] = finalInput;
          aggregate.$project = input;
          array.push(aggregate);
        }
        aggregate = {};
        input = {};
        finalInput = {};
        break;
      }
    }
  }
  return new Promise((resolve, reject) => {
    model.aggregate(array, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/*
 * softDeleteDocument : soft delete ( partially delete ) mongoose document
 * @param  model      : mongoose model
 * @param  id         : mongoose document's _id
 */
const softDeleteDocument = (model, id) => new Promise(async (resolve, reject) => {
  const result = await getSingleDocumentById(model, id);
  result.isDeleted = true;
  model.updateOne({ _id: id }, result, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * bulkInsert     : create document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  data   : {}
 */
const bulkInsert = (model, data) => new Promise((resolve, reject) => {
  model.insertMany(data, (err, result) => {
    if (result !== undefined && result.length > 0) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * bulkInsert     : update existing document in bulk mongoose document
 * @param  model  : mongoose model
 * @param  filter : {}
 * @param  data   : {}
 */
const bulkUpdate = (model, filter, data) => new Promise((resolve, reject) => {
  model.updateMany(filter, data, (err, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * countDocument : count total number of records in particular model
 * @param  model : mongoose model
 * @param where  : {}
 */
const countDocument = (model, where) => new Promise((resolve, reject) => {
  model.where(where).countDocuments((err, result) => {
    if (result !== undefined) {
      resolve(result);
    } else {
      reject(err);
    }
  });
});

/*
 * getDocumentByQuery : find document by dynamic query
 * @param  model      : mongoose model
 * @param  where      : {}
 * @param  select     : [] *optional
 */
const getDocumentByQuery = (model, where, select = []) => new Promise((resolve, reject) => {
  model.findOne(where, select, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * findOneAndUpdateDocument : find existing document and update mongoose document
 * @param  model   : mongoose model
 * @param  filter  : {}
 * @param  data    : {}
 * @param  options : {} *optional
 */
const findOneAndUpdateDocument = (model, filter, data, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndUpdate(filter, data, options, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

/*
 * findOneAndDeleteDocument : find existing document and delete mongoose document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const findOneAndDeleteDocument = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.findOneAndDelete(filter, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * deleteMany : delete multiple document
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
 */
const deleteMany = (model, filter, options = {}) => new Promise((resolve, reject) => {
  model.deleteMany(filter, options, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

/*
 * getSingleDocument : get single document with query, populate, and select
 * @param  model  : mongoose model
 * @param  filter  : {}
 * @param  options : {} *optional
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
  getDocumentByAggregation,
  findOneAndUpdateDocument,
  findOneAndDeleteDocument,
  deleteMany,
  getSingleDocument,
};
