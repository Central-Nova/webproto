const express = require('express');
const router = express.Router();
const { getCompany, createCompany, editCompany, addUserToCompany } = require('./controllers/companies');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');

// @route   GET api/companies
// @desc    get Company
// @access  public

router.get(
  '/',[userAuth,companyAuth], getCompany
);


// @route   POST api/companies
// @desc    Create Company
// @access  public

router.post(
  '/'
  ,
    [userAuth, sanitizeBody, [
      check('businessName', {title:'Error', description:'Please enter your business Name.'}).not().isEmpty(),
      check('ein', {title:'Error', description:'Please enter a valid EIN.'}).isNumeric().isLength({min: 8}),
      ], validationHandler],
  createCompany
);

// @route   PUT api/companies/:companyId
// @desc    Edit Company
// @access  Has company and has 'Account Information':'Edit' permission

router.put(
  '/company/:companyId'
  ,
    [userAuth, companyAuth, sanitizeBody,[
    check('businessAddress.street', {title:'Error', description:'Street is required.'}).not().isEmpty(),
    check('businessAddress.suite', {title:'Error', description:'Apt/Suite is required.'}).not().isEmpty(),
    check('businessAddress.city', {title:'Error', description:'City is required.'}).not().isEmpty(),
    check('businessAddress.state', {title:'Error', description:'State is required.'}).not().isEmpty(),
    check('businessAddress.zip', {title:'Error', description:'Zip code is required.'}).not().isEmpty(),
    check('warehouseAddress.street', {title:'Error', description:'Street is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.suite', {title:'Error', description:'Apt/Suite is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.city', {title:'Error', description:'City is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.state', {title:'Error', description:'State is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.zip', {title:'Error', description:'Zip code is required.'}).not().isEmpty().optional({nullable: true}),
    check('phone', {title:'Error', description:'Valid phone is required.'}).isNumeric(),
    check('email', {title:'Error', description:'Valid email is required.'}).isEmail(),
  ], validationHandler],
  editCompany
);

// @route   PUT api/companies/adduser
// @desc    Add user to company
// @access  Has company

router.put(
  '/adduser', [userAuth,companyAuth]
  , addUserToCompany
);

module.exports = router;