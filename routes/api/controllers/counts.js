const Count = require('../../../models/inventory/Count');
const Product = require('../../../models/products/Product')
const uniqueKeyHasValue = require('../../../lib/uniqueKeyHasValue');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');


const getCounts = async (req, res) => {
  apiLogger.debug('User requesting all inventory records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';

  try {

    // Query count by company id
    let queryStartTime = new Date();
    apiLogger.info('Searching db for counts by company', {collection: 'count',operation: 'read'})
  
    let counts = await Count.find({company: req.user.company})
    .sort(sort)
      .skip(page * limit)
        .limit(limit);

    apiLogger.debug('Count records found', {documents: counts.length, responseTime: `${new Date() - queryStartTime}ms`})

    // If there are no counts for this company, handle error
    if (counts.length === 0) {
      apiLogger.debug('No count records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No counts found.'}})
    }

    queryStartTime = new Date();
    apiLogger.info('Searching db for count of count records by company', {collection: 'count',operation: 'read'})

    // Count total counts for metadata
    let total = await Count.countDocuments({company: req.user.company});

    if (!total) {
      apiLogger.debug('No count records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No counts found.'}})
    }

    apiLogger.debug('Count records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', counts);
    apiLogger.debug('Sending product records by company', {documents: counts.length})

    // return formatted data and metadata
    const returnItem = {
        total,
        page,
        limit,
        counts
    }
    console.log('returnItem: ', returnItem);
    return res.send(returnItem);
    
    } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'One or more products could not be found.'}})      
    }
    return res.status(500).send('Server Error');
  }
}

const getCountById = async (req, res) => {
  apiLogger.debug('User requesting inventory record by inventory id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  try {
   
    // Query count record by company and object id
    let queryStartTime = new Date();
    apiLogger.info('Searching db for count by count id', {collection: 'count',operation: 'read'})

    let count = await Count.findOne({company: req.user.company, _id: req.params.countId})

    // Handle error if object id doesn't exist
    if (!count) {
      apiLogger.debug('No count record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Count record not found.'}})
    }
    apiLogger.debug('Count record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending count record by id', {documents: 1})
    // Send count record
    return res.send(count);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      console.log('wrong')
      apiLogger.warn('Invalid count id requested by user')
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Count record not found.'}})      
    }

    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const createCount = async (req,res) => {
  
  apiLogger.debug('User requesting to create new inventory record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })

  const { name, type, method, scheduled, products } = req.body
  
  try {

  // Check for existing products 
  let queryStartTime = new Date();
  apiLogger.debug('Searching DB to verify products', {collection: 'products',operation: 'read'})

  let productIds = await Product.find({company: req.user.company, _id: products}).select('_id')
  
  // Handle error if products are not found
  if (!productIds || productIds.length !== products.length) {
    apiLogger.debug('Products not found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res
    .status(400)
    .json({errors: [{ msg: {title: 'Error', description: 'One or more products not found.'}}]})
  }

  // Query inventory data
  let inventory = await Inventory.find({company: req.user.company, product: products}).populate({path:'product', select: '_id sku'}).select('product lot serial status')

  // Format inventory data
  let inventoryData = inventory.map(record => ({record, counts: []}))

  // Create
  queryStartTime = new Date();
  apiLogger.info('Creating new count in db', {collection: 'count',operation: 'create'})

  const newCount = new Count({
    company: req.user.company,
    name,
    type,
    method,
    scheduled,
    inventoryData,
    createdBy: req.user._id,
    lastEdited: new Date(),
    lastEditedBy: req.user._id,
  })
  console.log('newCount: ', newCount)
  console.log('newCount: ', newCount.inventoryData[0].record)
  console.log('newCount: ', newCount.inventoryData[1].record)
  await newCount.save();

  apiLogger.info('Count record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
  
    
    return res.status(200).json({msg: { title: 'Success', description: 'New count record created.'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'One or more products could not be found.'}})      
    }
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const editCount = async (req,res) => {
  
  apiLogger.debug('User requesting to update count record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    name,
    type,
    method,
    scheduled
  } = req.body;
    
    try {

    // Check if count exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for count  record in db', {collection: 'count',operation: 'findOne'})
    
    let count = await Count.findOne({
      company: req.user.company,
      _id: req.params.countId
    });

    // Handle error if inventory record isn't found
    if (!count) {
      apiLogger.warn('No count record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Count does not exist.'}}]})
    }
    apiLogger.debug('Count  record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    queryStartTime = new Date();
    apiLogger.info('Updating Inventory record in db', {collection: 'inventory',operation: 'save'})

    // Update fields
    count.name = name;
    count.type = type;
    count.method = method;
    count.scheduled = scheduled
    count.save();

    apiLogger.info('Count record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Count details have been updated!'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Count not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}

const editCountInventoryData = async (req,res) => {
  
  apiLogger.debug('User requesting to update count record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    result
  } = req.body;

  const { countId, inventoryDataId } = req.params
    
    try {

    // Check if count exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for count  record in db', {collection: 'count',operation: 'findOne'})
    
    let count = await Count.findOne({
      company: req.user.company,
      _id: countId
    });
    console.log('count: ', count)

    // Handle error if inventory record isn't found
    if (!count) {
      apiLogger.warn('No count record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Count does not exist.'}}]})
    }
    apiLogger.debug('Count  record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    queryStartTime = new Date();
    apiLogger.info('Updating Inventory record in db', {collection: 'inventory',operation: 'save'})

    // Add count object to inventory record counts array
    let targetRecord = count.inventoryData.find(item => item._id.toString() === inventoryDataId)

    // Handle error if target record isn't found
    if (!targetRecord) {
      console.log('targetRecord: ', targetRecord);
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Record does not exist.'}}]})
    }

    let targetRecordIndex = count.inventoryData.indexOf(targetRecord);
    // Add new count to counts array
    targetRecord.counts.push({
      countedBy: req.user._id,
      countedOn: new Date(),
      result
    })

    count.inventoryData[targetRecordIndex] = targetRecord
    count.save();

    apiLogger.info('Count record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Count details have been updated!'}})
    
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      console.log(error.kind);
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Count not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}


module.exports = {
    getCounts,
    getCountById,
    createCount,
    editCount,
    editCountInventoryData
}