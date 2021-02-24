const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const companyAuth = require('../../middleware/companyAuth');
const authorize = require('../../middleware/authorize');
const sanitizeReq = require('../../lib/sanitize');
const sanitize = require('mongo-sanitize');

const Product = require('../../models/Product');


// @route   GET api/products
// @desc    Get all products by company id with paginate query
// @access  Has company, has 'Catalog Entry':'View' permission
router.get('/', [companyAuth, authorize('Products', 'Catalog Entry', 'View')], async (req, res) => {

  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || 0;
  let sort = req.query.sort || '';
  let searchArray = req.query.search !== undefined && req.query.search.split(',') || '';
  let searchRegex = searchArray !== '' && searchArray.join('|') || '';

  try {
    
    let products = await Product.find({
      $and: [{company: req.user.company}, {
        $and: [{
          name: {$regex: searchRegex, $options: 'i'}}, {
            sku: {$regex: searchRegex, $options: 'i'}}]}]})
            .sort(sort).skip(page * limit).limit(limit);
    
    console.log('products: ', products);
    
    if (!products) {
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'No products found.'}})
    }
    
    let total = await Product.countDocuments({$and: [{company: req.user.company}, {$or: [{name: {$regex: searchRegex, $options: 'i'}}, {sku: {$regex: searchRegex, $options: 'i'}}]}]}).sort(sort);    
    
   
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
router.get('/product/:productId', [companyAuth, authorize('Products', 'Catalog Entry', 'View')], async (req, res) => {

  try {
   

    let product = await Product.findById(req.params.productId)

    if (!product) {
      return res
      .status(400)
      .json({msg: { title: 'Error', description: 'Product not found.'}})
    }

    console.log('product: ', product);
    return res.send(product);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res
        .status(400)
        .json({msg: { title: 'Error', description: 'Product not found.'}})      
      }
    return res.status(500).send('Server Error');
  }
})

// @route   POST api/products
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.post('/',
[companyAuth, authorize('Products', 'Catalog Entry', 'Create'), sanitizeReq,[
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

]], async (req,res) => {

  const { 
    products
  } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ errors: errors.array() })
    }

    // Check if units used in priceRules matches basePrice
    let priceRulesError = [];
    
    products.forEach(product => { 
      product.priceRules.forEach(rule => { 
        if (rule.unit !== product.basePrice.unit) {
          priceRulesError.push(true)
        }}
        )
    })

    if (priceRulesError.includes(true)) {
      return res
      .status(400)
      .json({errors: [{msg: {title: 'Error', description: 'This product does not use that unit.'}}]})
    }
    
     
  try {
    console.log('running trycatch');
    let updatedRecords = 0;
    let createdRecords = 0;

    for (let product of products) {

      const {sku, name, description, dimensions, weight, color, primaryMaterial, basePrice, priceRules} = product;

      let productData = {
        company: req.user.company,
        createdBy: req.user._id,
        ...product
      }
      console.log('productData: ', productData)
  
      // Find one and update
      let rawResult = await Product.findOneAndUpdate(
        {sku: productData.sku}, 
        {$set: productData},
        { new: true, 
        upsert: true,
        rawResult: true
      });
  
        // console.log('rawResult: ', rawResult)
  
      if (rawResult.lastErrorObject.updatedExisting) {
        console.log('before: ', updatedRecords)
        updatedRecords = updatedRecords + 1;
        console.log('after: ', updatedRecords)
      } else {
        createdRecords = createdRecords + 1;
      }
    }
    
    return res.status(200).json({msg: { title: 'Success', description: `${updatedRecords} records updated and ${createdRecords} records created.`} })
    
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
   
  }

})


// @route   POST api/products/product/:productId
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.put('/product/:productId',
[companyAuth, authorize('Products', 'Catalog Entry', 'Edit'), sanitizeReq,[
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

]], async (req,res) => {

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

  console.log('req.body: ', req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ errors: errors.array() })
    }

    let priceRulesError = [];

    priceRules.forEach(rule => { 
      if (rule.unit !== basePrice.unit) {
        priceRulesError.push(true)
      }
    })

    if (priceRulesError.includes(true)) {
      return res
      .status(400)
      .json({ msg: {title: 'Error', description: 'This product does not use that unit.'}})
    }
    
    try {
      
    // Check if product exists
    let product = await Product.findOneAndUpdate({
      company: req.user.company,
      _id: req.params.productId
    }, {
      sku, 
      name, 
      description,
      basePrice,
      priceRules,
      dimensions,
      weight,
      color,
      primaryMaterial,
      lastEdited: Date.now(),
      lastEditedBy: req.user._id,
    });

    if (!product) {
      return res
      .status(400)
      .json({msg: {title: 'Error', description: 'Product does not exist.'}})
    }


    product.save();

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