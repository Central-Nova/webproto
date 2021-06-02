const express = require('express');
const router = express.Router();
const { getCountGroups, getCountGroupsByProduct, getCountGroupById, createCountGroup, editCountGroup } = require('./controllers/countGroups');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');
const authorize = require('../../middleware/authorize');

// @route   GET api/countGroup
// @desc    Get countGroup
// @access  Has company and has 'Count Groups':'View' permission

router.get('/',[userAuth, companyAuth, authorize('Inventory', 'Count Groups', 'View')], getCountGroups);

// @route   GET api/countGroup/product/:productId
// @desc    Get countGroup by id
// @access  Has company and has 'Count Groups':'View' permission


router.get('/countGroup/:countGroupId', [userAuth,companyAuth, authorize('Inventory', 'Count Groups', 'View')], getCountGroupById);

// @route   POST api/countGroup
// @desc    Create countGroup
// @access  Has company and has 'Count Groups':'Create' permission

router.post('/', [userAuth, companyAuth, authorize('Inventory', 'Count Groups', 'Create'), sanitizeBody, [
        check('CountGroup.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('CountGroup.*.status', {title:'Error', description:'Cost is required.'}).not().isEmpty(),
        ], validationHandler],
        createCountGroup);

// @route   PUT api/countGroup
// @desc    Edit countGroup
// @access  Has company and has 'Count Groups':'Edit' permission

router.put('/countGroup/:countGroupId', [userAuth, companyAuth, authorize('Inventory', 'Count Groups', 'Edit'), sanitizeBody, [
        check('countGroup.*.serial', {title:'Error', description:'Lot code is required.'}).not().isEmpty(),
        check('countGroup.*.status', {title:'Error', description:'cost is required.'}).not().isEmpty(),
    ], validationHandler],
        editCountGroup);

module.exports = router;