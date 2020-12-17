const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  buyer: {
    manager: {
      sales: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }
            }
          ]
        }
      ],
      products: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      warehouse: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      fleet: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      payments: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ]
    },
    worker: {
      sales: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      products: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      warehouse: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      fleet: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      payments: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ]
    }
  },
  supplier: {
    manager: {
      sales: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }
            }
          ]
        }
      ],
      products: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      warehouse: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      fleet: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      payments: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ]
    },
    worker: {
      sales: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      products: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      warehouse: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      fleet: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ],
      payments: [
        {
          department: String,
          action: String,
          role: String,
          permission: [
            {
              type: {
                type: String,
              },
              allow: {
                type: Boolean
              }

            }
          ]
        }
      ]
    }
  }
})


module.exports = Role = new mongoose.model('role', RoleSchema);
