const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
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
