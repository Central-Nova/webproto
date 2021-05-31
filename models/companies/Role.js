const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  permissions: [
    {
      department: {
        type: String,
        required: true
      },
      document: {
        type: String,
        required: true
      },
      action: {
        type: String,
        required: true
      },
      manager: {
        type: Boolean,
        required: true
      },
      worker: {
        type: Boolean,
        required: true
      },
    }
  ]

})


module.exports = Role = new mongoose.model('role', RoleSchema);
