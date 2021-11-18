const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var idValidator = require('mongoose-id-validator');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    userId:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    token:{ type:String },

    tokenExpiredTime:{ type:Date },

    isTokenExpired:{
      type:Boolean,
      default:false
    },

    isDeleted:{ type:Boolean },

    isActive:{ type:Boolean },

    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt' 
    } 
  }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length){
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const {
    __v, ...object 
  } = this.toObject({ virtuals:true });
  object.id = object._id;
     
  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);

const userTokens = mongoose.model('userTokens',schema,'userTokens');
module.exports = userTokens;