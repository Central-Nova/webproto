const express = require('express');
const router = express.Router();
const { getInventory, getInventoryByProduct, getInventoryById, createInventory, editInventory } = require('./controllers/inventory');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');
const authorize = require('../../middleware/authorize');

// @route   GET api/inventory
// @desc    Get Inventory
// @access  Has company and has 'Inventory Units':'View' permission

router.get('/',[userAuth, companyAuth, authorize('Inventory', 'Inventory Units', 'View')], getInventory);

// @route   GET api/inventory/product/:productId
// @desc    Get Inventory by id
// @access  Has company and has 'Inventory Units':'View' permission

router.get('/product/:productId', [userAuth, companyAuth, authorize('Inventory', 'Inventory Units', 'View')], getInventoryByProduct);

// @route   GET api/inventory/inventory/:inventoryId
// @desc    Get Inventory by id
// @access  Has company and has 'Inventory Units':'View' permission

router.get('/inventory/:inventoryId', [userAuth, companyAuth, authorize('Inventory', 'Inventory Units', 'View')], getInventoryById);


// @route   POST api/inventory
// @desc    Create inventory
// @access  Has company and has 'Inventory Units':'View' permission

router.post('/', [userAuth, companyAuth, authorize('Inventory', 'Inventory Units', 'Create'),sanitizeBody, [
        check('inventory.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('inventory.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        ], validationHandler],  
        createInventory);

// @route   PUT api/inventory
// @desc    Edit Inventory
// @access  Has company and has 'Inventory Units':'Edit' permission

router.put('/inventory/:inventoryId', [userAuth, companyAuth, authorize('Inventory', 'Inventory Units', 'Edit'), sanitizeBody, [
        check('inventory.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('inventory.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
    ], validationHandler], 
        editInventory);

module.exports = router;