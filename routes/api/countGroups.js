const express = require('express');
const router = express.Router();
const { getCountGroups, getCountGroupsByProduct, getCountGroupById, createCountGroup, editCountGroup } = require('./controllers/countGroups');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/countGroup
// @desc    Get countGroup
// @access  private

router.get('/',[userAuth,companyAuth], getCountGroups);

// @route   GET api/countGroup/product/:productId
// @desc    Get countGroup by id
// @access  private


router.get('/countGroup/:countGroupId', [userAuth,companyAuth], getCountGroupById);

// @route   POST api/countGroup
// @desc    Create countGroup
// @access  private

router.post('/', [userAuth, sanitizeBody, [
        check('CountGroup.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('CountGroup.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        ], validationHandler], 
        createCountGroup);

// @route   PUT api/countGroup
// @desc    Edit countGroup
// @access  Has company and has 'Account Information':'Edit' permission

router.put('/countGroup/:countGroupId', [userAuth, companyAuth, sanitizeBody, [
        check('countGroup.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('countGroup.*.status', {title:'Error', description:'cost is required.'}).not().isEmpty(),
    ], validationHandler],
        editCountGroup);

module.exports = router;