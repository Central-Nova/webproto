const Inventory = require('../../../models/Inventory');
const Product = require('../../../models/Product')
const uniqueKeyHasValue = require('../../../lib/uniqueKeyHasValue');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');


const getInventory = async (req, res) => {
  apiLogger.debug('User requesting all lot records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';
  let searchArray = req.query.search !== undefined && req.query.search.split(',') || '';
  let searchRegex = searchArray !== '' && searchArray.join('|') || '';

  try {

    let queryStartTime = new Date();
    apiLogger.info('Searching db for products by company', {collection: 'products',operation: 'read'})

    let products = await Product.find({company: req.user.company});
    apiLogger.debug('Product records found', {documents: products.length, responseTime: `${new Date() - queryStartTime}ms`})

    if (products.length === 0) {
      apiLogger.debug('No product records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No products found.'}})
    }
    
    let formatData = () => {
        const promises = products.map(async (product) => {
            queryStartTime = new Date();
            apiLogger.info('Searching db for inventory by company', {collection: 'inventory',operation: 'read'})
        
            let inventory = await Inventory.countDocuments({company: req.user.company, product: product._id, status: 'sellable'})

            if (!inventory) {
            apiLogger.debug('No inventory records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
            }

            apiLogger.debug('Inventory records found', {documents: inventory, responseTime: `${new Date() - queryStartTime}ms`})
            return {
                _id: product._id,
                sku: product.sku,
                sellable: inventory
            }
        })
        return Promise.all(promises)
    }

    const formattedInventoryData = await formatData();
    console.log('formattedInventoryData: ', formattedInventoryData)

    queryStartTime = new Date();
    apiLogger.info('Searching db for count of products by company', {collection: 'products',operation: 'read'})

    let total = await Product.countDocuments({company: req.user.company});

    if (!total) {
      apiLogger.debug('No product records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No products found.'}})
    }

    apiLogger.debug('Product records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', products);
    apiLogger.debug('Sending product records by company', {documents: products})

    const returnItem = {
        total,
        page,
        limit,
        inventory: formattedInventoryData
    }
    console.log('returnItem: ', returnItem);
    return res.send(returnItem);
    
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
  }
}

const getInventoryByProduct = async (req, res) => {
  apiLogger.debug('User requesting all lot records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';
  let searchArray = req.query.search !== undefined && req.query.search.split(',') || '';
  let searchRegex = searchArray !== '' && searchArray.join('|') || '';

  try {

    let queryStartTime = new Date();
    apiLogger.info('Searching db for inventory by company', {collection: 'products',operation: 'read'})

    let inventory = await Inventory.find({company: req.user.company, product: req.params.productId}).select('serial lot status');
    apiLogger.debug('Inventory records found', {documents: inventory.length, responseTime: `${new Date() - queryStartTime}ms`})

    if (inventory.length === 0) {
      apiLogger.debug('No inventory records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No inventory records found.'}})
    }

    queryStartTime = new Date();
    apiLogger.info('Searching db for count of inventory records by company and product id', {collection: 'products',operation: 'read'})

    let total = await Inventory.countDocuments({company: req.user.company, product: req.params.productId});

    if (!total) {
      apiLogger.debug('No inventory records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No inventory records found.'}})
    }

    apiLogger.debug('Inventory records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', inventory.length);
    apiLogger.debug('Sending inventory records by company and product id', {documents: inventory.length})

    const returnItem = {
        total,
        page,
        limit,
        inventory
    }
    console.log('returnItem: ', returnItem);
    return res.send(returnItem);
    
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
  }
}

const getInventoryById = async (req, res) => {
  apiLogger.debug('User requesting inventory record by inventory id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  try {
   
    let queryStartTime = new Date();
    apiLogger.info('Searching db for inventory by inventory id', {collection: 'inventory',operation: 'read'})

    let inventory = await Inventory.findOne({company: req.user.company, _id: req.params.inventoryId})

    if (!inventory) {
      apiLogger.debug('No inventory record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Inventory record not found.'}})
    }
    apiLogger.debug('Inventory record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending inventory record by id', {documents: 1})
    return res.send(inventory);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        console.log('wrong')
        apiLogger.warn('Invalid inventory id requested by user')
        return res
        .status(400)
        .json({msg: { title: 'Error', description: 'Inventory record not found.'}})      
      }

      apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const createInventory = async (req,res) => {
  
  apiLogger.debug('User requesting to create new lot record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { inventory } = req.body;

  try {

    for (let unit of inventory) {

      // Check for existing lot by lot code
      let queryStartTime = new Date();
      apiLogger.debug('Searching DB for existing lot code', {collection: 'inventory',operation: 'read'})

      let existingUnit = await Inventory.findOne({serial: unit.serial})
      
      if (existingUnit) {
        apiLogger.debug('Existing inventory record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

        return res
        .status(400)
        .json({errors: [{ msg: {title: 'Error', description: 'Serial code is already in use.'}}]})
      }

      // Create
      queryStartTime = new Date();
      apiLogger.info('Creating new inventory record in db', {collection: 'inventory',operation: 'create'})

      const newUnit = new Inventory({
        company: req.user.company,
        createdBy: req.user._id,
        lastEdited: new Date(),
        lastEditedBy: req.user._id,
        ...unit
      })
      console.log('newUnit: ', newUnit)
      await newUnit.save();

      apiLogger.info('Inventory record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    }
    
    return res.status(200).json({msg: { title: 'Success', description: `${inventory.length} new inventory records created.`} })
    
  } catch (err) {
    console.log(err);
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
   
  }

}

const editInventory = async (req,res) => {
  
  apiLogger.debug('User requesting to update lot record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    inventory
  } = req.body;
    
    try {

    for (let lot of inventory) {
      // Check if lot exists
      let queryStartTime = new Date();
      apiLogger.debug('Searching for lot record in db', {collection: 'inventory',operation: 'findOne'})
      
      let currentLot = await Inventory.findOne({
        company: req.user.company,
        lotCode: lot.currentLotCode
      });
      if (!currentLot) {
        apiLogger.warn('No lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
        return res
        .status(400)
        .json({errors: [{msg: {title: 'Error', description: 'Lot does not exist.'}}]})
      }
      apiLogger.debug('Lot record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      
      // Check if new lotCode already exists
      queryStartTime = new Date();
      apiLogger.debug('Searching for existing lot record in db', {collection: 'inventory',operation: 'findOne'})
  
      let secondLot = await Inventory.findOne({
        company: req.user.company,
        lotCode: lot.newLotCode
      });
  
      if (secondLot._id.toString() !== currentLot._id.toString()) {
        apiLogger.warn('Existing lot code found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
        return res
        .status(400)
        .json({errors: [{msg: {title: 'Error', description: 'Lot code is already in use.'}}]})
      }
      apiLogger.debug('Lot code is available to use', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
  
      queryStartTime = new Date();
      apiLogger.info('Updating Lot record in db', {collection: 'inventory',operation: 'save'})
  
      currentLot.lotCode = lot.newLotCode;
      currentLot.cost = lot.cost;
      currentLot.dateExpiration = lot.dateExpiration;
      currentLot.dateManufacture = lot.dateManufacture;
      currentLot.save();
  
      apiLogger.info('Lot record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    }
      

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Lot details have been updated!'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Lot not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}

module.exports = {
    getInventory,
    getInventoryByProduct,
    getInventoryById,
    createInventory,
    editInventory
}