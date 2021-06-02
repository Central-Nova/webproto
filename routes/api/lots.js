const express = require('express');
const router = express.Router();
const { getLots, getLotById, createLot, editLot } = require('./controllers/lots');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');
const authorize = require('../../middleware/authorize');

// @route   GET api/lots
// @desc    Get Lots
// @access  Has company and has 'Inventory Lots':'View' permission

router.get('/',[userAuth, companyAuth, authorize('Inventory', 'Inventory Lots', 'View')], getLots);

// @route   GET api/lots/:lotId
// @desc    Get Lot by id
// @access  Has company and has 'Inventory Lots':'View' permission

router.get('/lot/:lotId', [userAuth, companyAuth, authorize('Inventory', 'Inventory Lots', 'View')], getLotById);


// @route   POST api/lots
// @desc    Create lots
// @access  Has company and has 'Inventory Lots':'Create' permission

router.post('/', [userAuth, companyAuth, authorize('Inventory', 'Inventory Lots', 'Create'), sanitizeBody, [
        check('lots.*.lotCode', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('lots.*.cost', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        ], validationHandler],  
        createLot);

// @route   PUT api/lots
// @desc    Edit lot
// @access  Has company and has 'Inventory Lots':'Edit' permission

router.put('/', [userAuth, companyAuth, authorize('Inventory', 'Inventory Lots', 'Edit'), sanitizeBody, [
        check('lots.*.currentLotCode', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('lots.*.cost', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        check('lots.*.dateExpiration', {title:'Error', description:'Expiration date is required.'}).not().isEmpty(),
        check('lots.*.dateManufacture', {title:'Error', description:'Manufacture date is required.'}).not().isEmpty(),
        ], validationHandler],  
        editLot);

module.exports = router;