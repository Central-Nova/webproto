const CountGroup = require('../../../models/inventory/CountGroup');
const Product = require('../../../models/products/Product')
const uniqueKeyHasValue = require('../../../lib/uniqueKeyHasValue');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');


const getCountGroups = async (req, res) => {
  apiLogger.debug('User requesting all inventory records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  try {

    // Query count groups by company id
    let queryStartTime = new Date();
    apiLogger.info('Searching db for count groups by company', {collection: 'countGroups', operation: 'read'})
  
    let countGroups = await CountGroup.find({company: req.user.company});
    
    // If there are no count groups for this company, handle error
    if (!countGroups) {
      console.log('no counts')
      apiLogger.debug('No count groups found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No count groups found.'}})
    }
    
    apiLogger.debug('Count groups found', {documents: countGroups.length, responseTime: `${new Date() - queryStartTime}ms`})
   
    httpContext.set('resDocs', countGroups);
    apiLogger.debug('Sending product records by company', {documents: countGroups.length})

    return res.send(countGroups);
    
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error');
  }
}

const getCountGroupsByProduct = async (req, res) => {
  apiLogger.debug('User requesting all inventory records by company and product', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';

  try {

    // Query inventory by company and product
    let queryStartTime = new Date();
    apiLogger.info('Searching db for inventory by company', {collection: 'products',operation: 'read'})

    let inventory = await Inventory.find({company: req.user.company, product: req.params.productId}).select('serial lot status').sort(sort).skip(page * limit).limit(limit);
    apiLogger.debug('Inventory records found', {documents: inventory.length, responseTime: `${new Date() - queryStartTime}ms`})

    // Handle error when the product doesn't have any inventory records
    if (inventory.length === 0) {
      apiLogger.debug('No inventory records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No inventory records found.'}})
    }

    queryStartTime = new Date();
    apiLogger.info('Searching db for countGroup of inventory records by company and product id', {collection: 'products',operation: 'read'})

    // CountGroup total inventory documents for the product for metadata
    let total = await Inventory.countGroupDocuments({company: req.user.company, product: req.params.productId});

    if (!total) {
      apiLogger.debug('No inventory records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No inventory records found.'}})
    }

    apiLogger.debug('Inventory records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', inventory.length);
    apiLogger.debug('Sending inventory records by company and product id', {documents: inventory.length})

    // return inventory records with meta data
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

const getCountGroupById = async (req, res) => {
  apiLogger.debug('User requesting inventory record by inventory id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  try {
   
    // Query inventory record by company and object id
    let queryStartTime = new Date();
    apiLogger.info('Searching db for inventory by inventory id', {collection: 'inventory',operation: 'read'})

    let inventory = await Inventory.findOne({company: req.user.company, _id: req.params.inventoryId})

    // Handle error if object id doesn't exist
    if (!inventory) {
      apiLogger.debug('No inventory record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Inventory record not found.'}})
    }
    apiLogger.debug('Inventory record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending inventory record by id', {documents: 1})
    // Send inventory record
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

const createCountGroup = async (req,res) => {
  
  apiLogger.debug('User requesting to create new inventory record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { products, name } = req.body;

  try {


    // Check if products
    let queryStartTime = new Date();
    apiLogger.debug('Searching DB for existing serial', {collection: 'inventory',operation: 'read'})

    let productIds = await Product.find({company: req.user.company, _id: products }).select('_id')
    console.log('productIds: ', productIds)
    
    // Handle error if serial already exists
    if (!productIds) {
      apiLogger.debug('No existing products found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({errors: [{ msg: {title: 'Error', description: 'Products not found.'}}]})
    }
    apiLogger.debug('Existing products found', {documents: productIds.length, responseTime: `${new Date() - queryStartTime}ms`})

    // Create
    queryStartTime = new Date();
    apiLogger.info('Creating new inventory record in db', {collection: 'inventory',operation: 'create'})

    const newCountGroup = new CountGroup({
      company: req.user.company,
      createdBy: req.user._id,
      lastEdited: new Date(),
      lastEditedBy: req.user._id,
      products: productIds.map(object => (object._id)),
      name
    })
    console.log('newCountGroup: ', newCountGroup)
    await newCountGroup.save();

    apiLogger.info('Count group created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    
    return res.status(200).json({msg: { title: 'Success', description: 'New count group created.'}})
    
  } catch (err) {
    console.log(err);
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const editCountGroup = async (req,res) => {
  
  apiLogger.debug('User requesting to update inventory record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    lot,
    serial,
    status
  } = req.body;
    
    try {

    // Check if inventory exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for inventory  record in db', {collection: 'inventory',operation: 'findOne'})
    
    let currentInventory = await Inventory.findOne({
      company: req.user.company,
      _id: req.params.inventoryId
    });
    console.log('currentInventory: ', currentInventory)

    // Handle error if inventory record isn't found
    if (!currentInventory) {
      apiLogger.warn('No inventory record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Inventory does not exist.'}}]})
    }
    apiLogger.debug('Inventory  record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    // Check if new serial already exists
    queryStartTime = new Date();
    apiLogger.debug('Searching for existing inventory  record in db', {collection: 'inventory',operation: 'findOne'})

    let secondInventory = await Inventory.findOne({
      company: req.user.company,
      serial: req.body.serial
    });

    // Handle error if serial already exists
    if (secondInventory._id.toString() !== currentInventory._id.toString()) {
      apiLogger.warn('Existing serial code found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Serial code is already in use.'}}]})
    }
    apiLogger.debug('Serial code is available to use', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    queryStartTime = new Date();
    apiLogger.info('Updating Inventory record in db', {collection: 'inventory',operation: 'save'})

    currentInventory.lot = lot;
    currentInventory.serial = serial;
    currentInventory.status = status;
    currentInventory.lastEdited = new Date();
    currentInventory.lastEditedBy = req.user._id;
    currentInventory.save();

    apiLogger.info('Inventory record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Inventory details have been updated!'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Inventory not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}

module.exports = {
    getCountGroups,
    getCountGroupsByProduct,
    getCountGroupById,
    createCountGroup,
    editCountGroup
}