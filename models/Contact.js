const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account'
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  }
});

module.exports = Contact = mongoose.model('contact', ContactSchema);
