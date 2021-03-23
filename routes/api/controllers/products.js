const Product = require('../../../models/Product');
const uniqueKeyHasValue = require('../../../lib/uniqueKeyHasValue');
const apiLogger = require('../../../config/loggers');
const httpContext = require('express-http-context');


const getProducts = async (req, res) => {
  apiLogger.debug('User requesting all product records by company', {
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

    let products = await Product.find({
      $and: [{company: req.user.company}, {
        $and: [{
          name: {$regex: searchRegex, $options: 'i'}}, {
            sku: {$regex: searchRegex, $options: 'i'}}]}]})
            .sort(sort).skip(page * limit).limit(limit);
    
   
    if (!products) {
      apiLogger.debug('No product records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No products found.'}})
    }
    apiLogger.debug('Product records found', {documents: products.length, responseTime: `${new Date() - queryStartTime}ms`})

    queryStartTime = new Date();
    apiLogger.info('Searching db for count of products by company', {collection: 'products',operation: 'read'})

    let total = await Product.countDocuments({$and: [{company: req.user.company}, {$or: [{name: {$regex: searchRegex, $options: 'i'}}, {sku: {$regex: searchRegex, $options: 'i'}}]}]}).sort(sort);

    if (!total) {
      apiLogger.debug('No product records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No products found.'}})
    }

    apiLogger.debug('Product records counted', {documents: total, responseTime: `${new Date() - queryStartTime}ms`})
    
    httpContext.set('resDocs', products.length);
    apiLogger.debug('Sending product records by company', {documents: products.length})

    return res.send({
      total,
      page,
      limit,
      products
    });
    
    } catch (error) {
    return res.status(500).send('Server Error');
  }
}

const getProductById = async (req, res) => {
  apiLogger.debug('User requesting product record by product id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  try {
   
    let queryStartTime = new Date();
    apiLogger.info('Searching db for product by product id', {collection: 'products',operation: 'read'})

    let product = await Product.findOne({company: req.user.company,_id: req.params.productId})

    if (!product) {
      console.log('no product');
      apiLogger.debug('No product record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})
    }
    apiLogger.debug('Product record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending product record by id', {documents: 1})
    console.log('end');
    return res.send(product);
    } catch (error) {

      if (error.kind === 'ObjectId') {
        apiLogger.warn('Invalid product id requested by user')
        return res
        .status(400)
        .json({msg: { title: 'Error', description: 'Product not found.'}})      
      }

      apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

const createProduct = async (req,res) => {
  
  apiLogger.debug('User requesting to create new product record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    products
  } = req.body;

  
  try {
    // Price rules are optional. Check if exists
    // Check if units used in priceRules matches basePrice
  
      product:
      for (let product of products) {
        if (product.priceRules) {
          rule:
          for(let i in product.priceRules) {
            let result = uniqueKeyHasValue(product.priceRules[i], 'unit', product.basePrice.unit)
  
            if (result) {
              apiLogger.warn('Price rules unit name does not match base unit name')
              return res
              .status(400)
              .json({errors: [{msg: {title: 'Error', description: 'This product does not use that unit.'}}]})              
            }
            
          }
        }
      }

    let updatedRecords = 0;
    let createdRecords = 0;

    for (let product of products) {

      let productData = {
        company: req.user.company,
        createdBy: req.user._id,
        ...product
      }
  
      // Find one and update
      let queryStartTime = new Date();
      apiLogger.info('Creating new product record in db', {collection: 'products',operation: 'create'})
  
      let rawResult = await Product.findOneAndUpdate(
        {sku: productData.sku}, 
        {$set: productData},
        { new: true, 
        upsert: true,
        rawResult: true
      });
      apiLogger.info('Product record created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

  
        console.log('rawResult: ', rawResult)
  
      if (rawResult.lastErrorObject.updatedExisting) {
        updatedRecords = updatedRecords + 1;
      } else {
        createdRecords = createdRecords + 1;
      }
    }
    
    return res.status(200).json({msg: { title: 'Success', description: `${updatedRecords} records updated and ${createdRecords} records created.`} })
    
  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
   
  }

}

const editProduct = async (req,res) => {
  
  apiLogger.debug('User requesting to update product record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    sku, 
    name, 
    description,
    basePrice,
    priceRules,
    dimensions,
    weight,
    color,
    primaryMaterial,

  } = req.body;

    let priceRulesError = [];

    priceRules.forEach(rule => { 
      if (rule.unit !== basePrice.unit) {
        priceRulesError.push(true)
      }
    })

    if (priceRulesError.includes(true)) {
      apiLogger.warn('Price rules unit name does not match')

      return res
      .status(400)
      .json({ msg: {title: 'Error', description: 'This product does not use that unit.'}})
    }
    
    try {
      
    // Check if product exists
    let queryStartTime = new Date();
    apiLogger.debug('Searching for product record in db', {collection: 'products',operation: 'update'})

    let product = await Product.findOne({
      company: req.user.company,
      _id: req.params.productId
    });
    console.log('product: ', product);
    if (!product) {
      apiLogger.warn('No product record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'Product does not exist.'}}]})
    }
    apiLogger.debug('Product record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
    
    queryStartTime = new Date();
    apiLogger.info('Updating product record in db', {collection: 'products',operation: 'update'})
    await Product.findOneAndUpdate({sku, 
      name, 
      description,
      basePrice,
      priceRules,
      dimensions,
      weight,
      color,
      primaryMaterial,
      lastEdited: Date.now(),
      lastEditedBy: req.user._id,})

      apiLogger.info('Product record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Product details have been updated!'}})
    
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  editProduct
}