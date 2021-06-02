const express = require('express');
const router = express.Router();
const { getCounts, getCountById, createCount, editCount, editCountInventoryData } = require('./controllers/counts');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');
const authorize = require('../../middleware/authorize');

// @route   GET api/count
// @desc    Get count
// @access  Has company and has 'Counting Tasks':'View' permission

router.get('/',[userAuth, companyAuth, authorize('Inventory', 'Counting Tasks', 'View')], getCounts);

// @route   GET api/count/count/:countId
// @desc    Get count by id
// @access  Has company and has 'Counting Tasks':'View' permission

router.get('/count/:countId', [userAuth, companyAuth, authorize('Inventory', 'Counting Tasks', 'View')], getCountById);

// @route   POST api/count
// @desc    Create count
// @access  Has company and has 'Counting Tasks':'Create' permission

router.post('/', [userAuth, companyAuth, authorize('Inventory', 'Counting Tasks', 'Create'), sanitizeBody, [
        check('name', {title:'Error', description:'Name is required.'}).not().isEmpty(),
        check('type', {title:'Error', description:'Count type is required.'}).not().isEmpty(),        
        check('method', {title:'Error', description:'Count method is required.'}).not().isEmpty(),       
         check('scheduled', {title:'Error', description:'Date is required.'}).not().isEmpty(),
        ], validationHandler],   
        createCount);

// @route   PUT api/count
// @desc    Edit count
// @access  Has company and has 'Counting Tasks':'Edit' permission

router.put('/count/:countId', [userAuth, companyAuth, authorize('Inventory', 'Counting Tasks', 'Edit'), sanitizeBody, [
        check('name', {title:'Error', description:'Name is required.'}).not().isEmpty(),
        check('type', {title:'Error', description:'Count type is required.'}).not().isEmpty(),        
        check('method', {title:'Error', description:'Count method is required.'}).not().isEmpty(),       
        check('scheduled', {title:'Error', description:'Date is required.'}).not().isEmpty(),
    ], validationHandler],
        editCount);

// @route   PUT api/count
// @desc    Edit count inventoryData record
// @access  Has company and has 'Counting Tasks':'Edit' permission

router.put('/count/:countId/inventoryData/:inventoryDataId', [userAuth, companyAuth, authorize('Inventory', 'Counting Tasks', 'Edit'), sanitizeBody, [
        check('result', {title:'Error', description:'Result is required.'}).not().isEmpty(),
    ], validationHandler],  
        editCountInventoryData);

module.exports = router;