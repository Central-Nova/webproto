const express = require('express');
const router = express.Router();
const { getCount, getCountByProduct, getCountById, createCount, editCount } = require('./controllers/counts');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/count
// @desc    Get count
// @access  private

router.get('/',[userAuth,companyAuth], getCount);

// @route   GET api/count/product/:productId
// @desc    Get count by id
// @access  private

router.get('/product/:productId', [userAuth,companyAuth], getCountByProduct);

// @route   GET api/count/count/:countId
// @desc    Get count by id
// @access  private

router.get('/count/:countId', [userAuth,companyAuth], getCountById);

// @route   POST api/count
// @desc    Create count
// @access  private

router.post('/', [userAuth, sanitizeBody, [
        check('products.*', {title:'Error', description:'Select at least one product.'}).not().isEmpty(),
        ], validationHandler], 
        createCount);

// @route   PUT api/count
// @desc    Edit count
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/count/:countId', [userAuth, companyAuth, sanitizeBody, [
        check('count.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('count.*.status', {title:'Error', description:'cost is required.'}).not().isEmpty(),
    ], validationHandler],
        editCount);

module.exports = router;