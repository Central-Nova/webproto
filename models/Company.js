const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String
  },
  ein: {
    type: Number,
    // required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  primary: {
    type: String
  },
  secondary: {
    type: String
  },
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
  }

});

module.exports = Company = mongoose.model('company', CompanySchema);
