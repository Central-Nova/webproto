const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  type: { type: String },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  date: { type: Date, default: Date.now }
});

module.exports = Account = mongoose.model('account', AccountSchema);
