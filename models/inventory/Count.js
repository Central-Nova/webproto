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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inventory'
      },
      counts: [
        {
          countedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
          },
          countedOn: Date,
          result: {
            type: Boolean,
            required: true
          }
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
