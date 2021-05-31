const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ein: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  operation: {
    type: String
  },
  addressBusiness: {
    street: {
      type: String
    },
    suite: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    }
  },
  addressWarehouse: {
    street: {
      type: String
    },
    suite: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    }
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      dateAdded: {
        type: Date,
        default: Date.now
      }
    }
  ],
  email: {
    type: String,
    // required: true
  },
  phoneWork: {
    type: Number,
    // required: true
  },
  phonePersonal: {
    type: Number
  },
  phoneFax: {
    type: Number
  },
});

module.exports = Company = mongoose.model('company', CompanySchema);
