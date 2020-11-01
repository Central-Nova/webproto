const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  local: {
    email: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  date: {
    type: String,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = User = new mongoose.model('user', UserSchema);
