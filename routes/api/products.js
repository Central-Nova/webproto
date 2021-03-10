const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const sanitizeReq = require('../../lib/sanitize');
const httpContext = require('express-http-context');
const validationHandler = require('../../middleware/validationHandler');

const Product = require('../../models/Product');


// @route   GET api/products
// @desc    Get all products by company id with paginate query
// @access  Has company, has 'Catalog Entry':'View' permission
router.get('/', [userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'View')], async (req, res) => {
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
      console.log('error: ', error);
    return res.status(500).send('Server Error');
  }
})

// @route   GET api/products/product/:productId
// @desc    Get by product ID
// @access  Has company, has 'Catalog Entry':'View' permission
router.get('/product/:productId', [userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'View')], async (req, res) => {
  apiLogger.debug('User requesting product record by product id', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  try {
   
    let queryStartTime = new Date();
    apiLogger.info('Searching db for product by product id', {collection: 'products',operation: 'read'})

    let product = await Product.findById(req.params.productId)

    if (!product) {
      apiLogger.debug('No product record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})
    }
    apiLogger.debug('Product record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.info('Sending product record by id', {documents: 1})
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
})

// @route   POST api/products
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.post('/',
[userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'Create'), sanitizeReq,[
  check('products.*.sku', { title: 'Error', description: 'Please enter a valid SKU.' }).not().isEmpty().isLength({ min:4, max: 20 }),
  check('products.*.name', { title: 'Error', description: 'Please enter a product name.' }).not().isEmpty().isLength({ max: 80 }),
  check('products.*.description', { title: 'Error', description: 'Please enter a product description.' }).not().isEmpty().isLength({ max: 200 }),
  check('products.*.basePrice.unit', { title: 'Error', description: 'Please enter a unit name.' }).not().isEmpty(),
  check('products.*.basePrice.subUnit', { title: 'Error', description: 'Please enter a sub unit name.' }).not().isEmpty(),
  check('products.*.basePrice.contains', { title: 'Error', description: 'Please enter number of sub units.' }).not().isEmpty().isNumeric(),
  check('products.*.basePrice.price', { title: 'Error', description: 'Please enter a price.' }).not().isEmpty().isNumeric(),
  check('products.*.priceRules.*.quantity', { title: 'Error', description: 'Please enter a valid quantity for the price rule.' }).isNumeric(),
  check('products.*.priceRules.*.price', { title: 'Error', description: 'Please enter a valid price for the price rule.' }).isNumeric(),
  check('products.*.weight', { title: 'Error', description: 'Please only use numbers for weight.' }).optional({nullable: true}).isNumeric(),
  check('products.*.dimensions.length', { title: 'Error', description: 'Please only use numbers for product length.' }).optional({nullable: true}).isNumeric(),
  check('products.*.dimensions.width', { title: 'Error', description: 'Please only use numbers for product width.' }).optional({nullable: true}).isNumeric(),
  check('products.*.dimensions.height', { title: 'Error', description: 'Please only use numbers for product height.' }).optional({nullable: true}).isNumeric(),

], validationHandler], async (req,res) => {
  
  apiLogger.debug('User requesting to create new product record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  
  const { 
    products
  } = req.body;

    // Price rules are optional. Check if exists
    // Check if units used in priceRules matches basePrice
    
    if (products.priceRules) {
      let priceRulesError = [];
      
      products.forEach(product => { 
        product.priceRules.forEach(rule => { 
          if (rule.unit !== product.basePrice.unit) {
            priceRulesError.push(true)
          }}
          )
      })

      if (priceRulesError.includes(true)) {
        apiLogger.warn('Price rules unit name does not match')
        return res
        .status(400)
        .json({errors: [{msg: {title: 'Error', description: 'This product does not use that unit.'}}]})
      }
    }

    
     
  try {
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

  
        // console.log('rawResult: ', rawResult)
  
      if (rawResult.lastErrorObject.updatedExisting) {
        updatedRecords = updatedRecords + 1;
      } else {
        createdRecords = createdRecords + 1;
      }
    }
    
    return res.status(200).json({msg: { title: 'Success', description: `${updatedRecords} records updated and ${createdRecords} records created.`} })
    
  } catch (err) {
    apiLogger.error('Caught error');
    console.log(err);
    return res.status(500).send('Server Error');
   
  }

})


// @route   PUT api/products/product/:productId
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.put('/product/:productId',
[userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'Edit'), sanitizeReq,[
  check('sku', { title: 'Error', description: 'Please enter a valid SKU.' }).not().isEmpty().isLength({ min:4, max: 20 }),
  check('name', { title: 'Error', description: 'Please enter a product name.' }).not().isEmpty().isLength({ max: 80 }),
  check('description', { title: 'Error', description: 'Please enter a product description.' }).not().isEmpty().isLength({ max: 200 }),
  check('basePrice.unit', { title: 'Error', description: 'Please enter a unit name.' }).not().isEmpty(),
  check('basePrice.subUnit', { title: 'Error', description: 'Please enter a sub unit name.' }).not().isEmpty(),
  check('basePrice.contains', { title: 'Error', description: 'Please enter number of sub units.' }).not().isEmpty().isNumeric(),
  check('basePrice.price', { title: 'Error', description: 'Please enter a price.' }).not().isEmpty().isNumeric(),
  check('priceRules.*.quantity', { title: 'Error', description: 'Please enter a valid quantity for the price rule.' }).isNumeric(),
  check('priceRules.*.price', { title: 'Error', description: 'Please enter a valid price for the price rule.' }).isNumeric(),
  check('weight', { title: 'Error', description: 'Please only use numbers for weight.' }).isNumeric(),
  check('dimensions.length', { title: 'Error', description: 'Please only use numbers for product length.' }).isNumeric(),
  check('dimensions.width', { title: 'Error', description: 'Please only use numbers for product width.' }).isNumeric(),
  check('dimensions.height', { title: 'Error', description: 'Please only use numbers for product height.' }).isNumeric(),

], validationHandler], async (req,res) => {
  
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
    console.log(error);
    if (error.kind === 'ObjectId') {
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})      
    }
    return res.status(500).send('Server Error');
   
  }

})


module.exports = router;