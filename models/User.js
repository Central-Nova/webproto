const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: String,
  local: {
    salt: String,
    hash: String
  },
  google: {
    googleId: String,
  },
  date: {
    type: String,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  rolesBuyer: [{
    department: {
      type: String
    },
    role: {
      type: String
    }
  }],
  rolesSupplier: [{
    department: {
      type: String
    },
    role: {
      type: String
    }
  }],
  defaultView: {
    type: String,
    default: 'Supplier'
  }
});

module.exports = User = new mongoose.model('user', UserSchema);
