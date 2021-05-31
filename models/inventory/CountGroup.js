const mongoose = require('mongoose');

const CountGroupSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  name: String,
  products: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
    }
  ],
  lastCount: Date,
  created: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  lastEdited: Date,
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
});

module.exports = CountGroup = mongoose.model('countGroup', CountGroupSchema);
