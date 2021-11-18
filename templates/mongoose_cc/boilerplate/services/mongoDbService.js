/* eslint-disable */
function makeMongoDbService({ model }) {
  const createDocument = (data) => new Promise((resolve, reject) => {
    model.create(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const updateDocument = (id, data) => {
    const newData = { ...data };
    delete newData.id;
    return new Promise((resolve, reject) => {
      model.updateOne({ _id: id }, newData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };

  const deleteDocument = (id) => new Promise((resolve, reject) => {
    model.deleteOne(id, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getAllDocuments = (query, options) => new Promise((resolve, reject) => {
    model.paginate(query, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getSingleDocumentById = (id, select = []) => new Promise((resolve, reject) => {
    model.findOne({ _id: id }, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getSingleDocumentByQuery = (where, select = []) => new Promise((resolve, reject) => {
    model.findOne(where, select, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  //  Request Query
  // {
  //     "query":{
  //         "and":[
  //             {"Name":"Dhiraj"},{"Salary":300}
  //         ],
  //         "or":[
  //           {"Name":"Dhiraj"},{"Salary":300}
  //         ]
  //     },
  //     "model":"Employee"
  // }

  const findExistsData = (data) => {
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

  const softDeleteDocument = (id,loggedInUser) => new Promise(async (resolve, reject) => {
    const result = await getSingleDocumentById(id);
    if (result) {
      result.isDeleted = true;

      if(loggedInUser && loggedInUser.id){
        result.updatedBy=loggedInUser.id
      }     
      delete result.id;
      model.updateOne({ _id: id }, result, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }
    resolve('No Data Found');
  });

  const softDeleteByQuery = (query,loggedInUser) => new Promise(async (resolve, reject) => {
    const result = await getSingleDocumentByQuery(query);
    if (result) {
      result.isDeleted = true;
      if(loggedInUser && loggedInUser.id){
        result.updatedBy=loggedInUser.id
      }  
      delete result.id;
      model.updateOne(query, result, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }
    resolve('No Data Found');
  });
  const bulkInsert = (data) => new Promise((resolve, reject) => {
    model.insertMany(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const bulkUpdate = (filter, data) => new Promise((resolve, reject) => {
    model.updateMany(filter, data, (err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });

  const countDocument = (where) => new Promise((resolve, reject) => {
    model.where(where).countDocuments((err, result) => {
      if (result !== undefined) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
  const findOneAndUpdateDocument = (filter, data, options = {}) => new Promise((resolve, reject) => {
    model.findOneAndUpdate(filter, data, options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  const findOneAndDeleteDocument = (filter, options = {}) => new Promise((resolve, reject) => {
    model.findOneAndDelete(filter, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const getDocumentByAggregation = (query) => {
    let keyInJson, valuesOfAggregate;
    let valuesOfFields, keysOfFields;
    let input = {}, finalInput = {}, aggregate = {};
    let array = [];
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
                                    finalInput[`$${key}`]='';
                                    finalInput[`$${key}`]+= `$${j}`;
                                    input[j] = finalInput;
                                    finalInput = {};
                                }
                                aggregate.$group = input;
                                array.push(aggregate);
                            } else {
                                input._id = `$${keysOfFields[nestKey]}`;
                                finalInput[`$${key}`]='';
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
                        input[projectKeys]=finalInput;
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
  }

  const deleteMany = (filter, options = {}) => new Promise((resolve, reject) => {
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
  const getSingleDocument = async (filter = {}, options = {}) => {
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

  return Object.freeze({
    createDocument,
    updateDocument,
    deleteDocument,
    getAllDocuments,
    getSingleDocumentById,
    findExistsData,
    softDeleteDocument,
    softDeleteByQuery,
    bulkInsert,
    bulkUpdate,
    countDocument,
    getSingleDocumentByQuery,
    findOneAndUpdateDocument,
    findOneAndDeleteDocument,
    getDocumentByAggregation,
    deleteMany,
    getSingleDocument
  });
}
module.exports = makeMongoDbService;
