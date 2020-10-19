const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String
  },
  addressBusiness: {
    type: String,
    required: true
  },
  addressShipping: {
    type: String
  },
  ein: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneWork: {
    type: Number,
    required: true
  },
  phonePersonal: {
    type: Number
  },
  phoneFax: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  // users: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'user'
  //     },
  //     role: {
  //       type: String
  //     },
  //     dateAdded: {
  //       type: Date,
  //       default: Date.now
  //     }
  //   }
  // ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Company = mongoose.model('company', CompanySchema);
