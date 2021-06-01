const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  name: String,
  type: String,
  method: String,
  scheduled: Date,
  inventoryData: [
    {
      record: {
        product: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
          },
          sku: String
        },
        lot: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'lot'
        },
        serial: String,
        status: String
      },
      counts: [
        {
          countedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          },
          countedOn: Date,
          result: Boolean
        }
      ] 
    }
  ],
  discrepancies: [
    {
      serial: String,
      notes: String
    }
  ],
  completed: {
    type: Boolean,
    default: false,
    required: true
  },
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

module.exports = Count = mongoose.model('count', CountSchema);
