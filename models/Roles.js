const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  sales: {
    manager: {

    },
    worker: {
      
    }
  },
  inventory: {
    manager: {

    },
    worker: {
      
    }
  },
  warehouse: {
    manager: {

    },
    worker: {
      
    }
  },
  fleet: {
    manager: {

    },
    worker: {
      
    }
  },
  accounting: {
    manager: {

    },
    worker: {
      
    }
  }

})

module.exports = Role = new mongoose.model('role', RoleSchema);