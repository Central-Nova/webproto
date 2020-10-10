const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  ein: {
    type: Number
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      role: {
        type: String
      },
      dateAdded: {
        type: Date
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Company = mongoose.model('company', CompanySchema);
