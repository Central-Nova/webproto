const sales = [
  {quotes: {actions: [
  'view', 'create', 'edit', 'send', 'delete'
]}},
  {salesOrders: {actions: [
    'view', 'create', 'edit', 'send', 'delete'
  ]}},
  {refunds: {actions: [
    'view', 'create', 'edit', 'send', 'delete'
  ]}}]

const product = [
  {catalogEntry: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {productLotting: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {productAdjustments: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {productTransformations: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {inventoryCounting: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }}
]

const warehouse = [
  {salesOrders: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {pickingOrders: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {packingOrders: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
]

const fleet = [
  {zones: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {routes: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {drivers: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
]

const payment = [
  {payments: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
  {reports: {
    actions: [
      'view', 'create', 'edit', 'send', 'delete'
    ]
  }},
]

const allActions = {
  sales, product, warehouse, fleet, payment
}


module.exports.allActions = allActions
