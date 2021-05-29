const express = require('express');
const router = express.Router();
const { getInventory, getInventoryByProduct, getInventoryById, createInventory, editInventory } = require('./controllers/inventory');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/inventory
// @desc    Get Inventory
// @access  private

router.get('/',[userAuth,companyAuth], getInventory);

// @route   GET api/inventory/product/:productId
// @desc    Get Inventory by id
// @access  private

router.get('/product/:productId', [userAuth,companyAuth], getInventoryByProduct);

// @route   GET api/inventory/inventory/:inventoryId
// @desc    Get Inventory by id
// @access  private

router.get('/inventory/:inventoryId', [userAuth,companyAuth], getInventoryById);


// @route   POST api/inventory
// @desc    Create inventory
// @access  private

router.post('/', [userAuth, sanitizeBody, [
        check('inventory.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('inventory.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        ], validationHandler], 
        createInventory);

// @route   PUT api/inventory
// @desc    Edit Inventory
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/', [userAuth, companyAuth, sanitizeBody, [
        check('inventory.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('inventory.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
    ], validationHandler],
        editInventory);

module.exports = router;