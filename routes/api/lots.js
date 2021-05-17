const express = require('express');
const router = express.Router();
const { getLots, getLotById, createLot, editLot } = require('./controllers/lots');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/lots
// @desc    Get Lots
// @access  private

router.get('/',[userAuth,companyAuth], getLots);

// @route   GET api/lots/:lotId
// @desc    Get Lot by id
// @access  private

router.get('/:lotId', [userAuth,companyAuth], getLotById);


// @route   POST api/lots
// @desc    Create lots
// @access  private

router.post('/', [userAuth, sanitizeBody, [
        check('lots.*.lotCode', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('lots.*.cost', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        check('lots.*.sku', {title:'Error', description:'SKU is required.'}).not().isEmpty(),
        ], validationHandler], 
        createLot);

// @route   PUT api/lots
// @desc    Edit lot
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/', [userAuth, companyAuth, sanitizeBody, [
        check('lotCode', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('cost', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        check('dateExpiration', {title:'Error', description:'Expiration date is required.'}).not().isEmpty(),
        check('dateManufacture', {title:'Error', description:'Manufacture date is required.'}).not().isEmpty(),
        ], validationHandler],
        editLot);

module.exports = router;