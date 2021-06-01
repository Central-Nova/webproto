const express = require('express');
const router = express.Router();
const { getCounts, getCountById, createCount, editCount } = require('./controllers/counts');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/count
// @desc    Get count
// @access  private

router.get('/',[userAuth,companyAuth], getCounts);

// @route   GET api/count/count/:countId
// @desc    Get count by id
// @access  private

router.get('/count/:countId', [userAuth,companyAuth], getCountById);

// @route   POST api/count
// @desc    Create count
// @access  private

router.post('/', [userAuth, sanitizeBody, [
        check('name', {title:'Error', description:'Name is required.'}).not().isEmpty(),
        check('type', {title:'Error', description:'Count type is required.'}).not().isEmpty(),        
        check('method', {title:'Error', description:'Count method is required.'}).not().isEmpty(),       
         check('scheduled', {title:'Error', description:'Date is required.'}).not().isEmpty(),
        ], validationHandler], 
        createCount);

// @route   PUT api/count
// @desc    Edit count
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/count/:countId', [userAuth, companyAuth, sanitizeBody, [
        check('name', {title:'Error', description:'Name is required.'}).not().isEmpty(),
        check('type', {title:'Error', description:'Count type is required.'}).not().isEmpty(),        
        check('method', {title:'Error', description:'Count method is required.'}).not().isEmpty(),       
         check('scheduled', {title:'Error', description:'Date is required.'}).not().isEmpty(),
    ], validationHandler],
        editCount);

// @route   PUT api/count
// @desc    Edit count
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/count/:countId/inventoryData/:inventoryDataId', [userAuth, companyAuth, sanitizeBody, [
        check('name', {title:'Error', description:'Name is required.'}).not().isEmpty(),
        check('type', {title:'Error', description:'Count type is required.'}).not().isEmpty(),        
        check('method', {title:'Error', description:'Count method is required.'}).not().isEmpty(),       
         check('scheduled', {title:'Error', description:'Date is required.'}).not().isEmpty(),
    ], validationHandler],
        editCount);

module.exports = router;