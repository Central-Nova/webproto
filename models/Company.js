const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String
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
      dateAdded: {
        type: Date,
        default: Date.now
      }
    }
  ],
  buyer: {
    addressBusiness: {
      street: {
        type: String
      },
      aptSuite: {
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
      aptSuite: {
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
    ein: {
      type: Number,
      // required: true
    },
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
    date: {
      type: Date,
      default: Date.now
    }
  },
  supplier: {
    addressBusiness: {
      street: {
        type: String
      },
      aptSuite: {
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
      aptSuite: {
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
    ein: {
      type: Number,
      // required: true
    },
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
    date: {
      type: Date,
      default: Date.now
    }
  }

});

module.exports = Company = mongoose.model('company', CompanySchema);
