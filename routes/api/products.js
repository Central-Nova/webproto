const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { getProducts, getProductById, createProduct, editProduct } = require('./controllers/products');

// Middleware
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const sanitizeBody = require('../../middleware/sanitizeBody');
const validationHandler = require('../../middleware/validationHandler');


// @route   GET api/products
// @desc    Get all products by company id with paginate query
// @access  Has company, has 'Catalog Entry':'View' permission
router.get('/', [userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'View')], getProducts)

// @route   GET api/products/product/:productId
// @desc    Get by product ID
// @access  Has company, has 'Catalog Entry':'View' permission
router.get('/product/:productId', [userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'View')], getProductById)

// @route   POST api/products
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.post('/',
[userAuth, companyAuth, authorize('Products', 'Catalog Entry', 'Create'), sanitizeBody,[
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

], validationHandler], createProduct)


// @route   PUT api/products/product/:productId
// @desc    Create product
// @access  Has company, has 'Catalog Entry':'Create' permission

router.put('/product/:productId',
[userAuth,companyAuth, authorize('Products', 'Catalog Entry', 'Edit'), sanitizeBody,[
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

], validationHandler], editProduct)


module.exports = router;