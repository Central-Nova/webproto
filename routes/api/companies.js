const express = require('express');
const router = express.Router();

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const httpContext = require('express-http-context');
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');


// Models
const Company = require('../../models/Company');

// @route   GET api/companies
// @desc    get Company
// @access  public

router.get(
  '/',[userAuth,companyAuth], async (req, res) => {
    apiLogger.debug('Requesting company data', {
      body: req.body,
      params: req.params,
      query: req.query
    })
  

    try {

      // Check for existing company
      let queryStartTime = new Date();
      apiLogger.info('Searching DB for company', {collection: 'companies',operation: 'read'})

      let company = await Company.findById(req.user.company);
      
      if (!company) {
        apiLogger.warn('Company record not found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
        
        return res
        .status(401)
        .json({ errors: [{ msg: {title: 'Error', description: 'Company not found.'}  }] });
      }
      apiLogger.info('Company record found', {responseTime: `${new Date() - queryStartTime}ms`})

      httpContext.set('resDocs', 1);
      apiLogger.debug('Sending company data')
      return res.send(company)


    } catch (err) {
      apiLogger.error('Caught error')
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);


// @route   POST api/companies
// @desc    Create Company
// @access  public

router.post(
  '/'
  ,
    [userAuth,[check('businessName', {title:'Error', description:'Please enter your business Name.'}).not().isEmpty(),
    check('ein', {title:'Error', description:'Please enter a valid EIN.'}).isNumeric().isLength({min: 8}),
  ], validationHandler],
  async (req, res) => {

    apiLogger.debug('User requesting to create company', {
      params: req.params || '',
      query: req.query || '',
      body: req.body || ''
    })
  

    const {
      businessName,
      ein,
    } = req.body;

    try {

      // Check for existing company by owner
      let queryStartTime = new Date();
      apiLogger.debug('Searching DB for existing company owner', {collection: 'companies',operation: 'read'})

      let companyOwner = await Company.findOne({owner: req.user._id})
      
      if (companyOwner) {
        apiLogger.debug('Existing company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

        return res
        .status(400)
        .json({errors: [{ msg: {title: 'Error', description: 'You already have a company.'}}]})
      }

      // Check for existing company by EIN
      queryStartTime = new Date();
      apiLogger.debug('Searching DB for existing company ein', {collection: 'companies',operation: 'read'})

      let companyEin = await Company.findOne({ ein });

      if (companyEin) {
        apiLogger.debug('Existing company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Company already exists.'}  }] });
      }

      
      company = new Company({
        name: businessName,
        owner: req.user.id,
        ein,
        users: [{
          user: req.user.id
        }]
      });

      queryStartTime = new Date();
      apiLogger.info('Creating new company record in DB', {collection: 'companies',operation: 'create'})
      await company.save();
      apiLogger.info('New company created', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      // Send company ID with response object (ised for adding company to user record)
      httpContext.set('resDocs', 1);
      apiLogger.debug('Sending company id')
      return res.status(200).json(company._id);

    } catch (err) {
      apiLogger.error('Caught error')

      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

// @route   PUT api/companies/:companyId
// @desc    Edit Company
// @access  Has company and has 'Account Information':'Edit' permission

router.put(
  '/company/:companyId'
  ,
 [ userAuth, companyAuth, sanitizeBody,[
    check('businessAddress.street', {title:'Error', description:'Street is required.'}).not().isEmpty(),
    check('businessAddress.aptSuite', {title:'Error', description:'Apt/Suite is required.'}).not().isEmpty(),
    check('businessAddress.city', {title:'Error', description:'City is required.'}).not().isEmpty(),
    check('businessAddress.state', {title:'Error', description:'State is required.'}).not().isEmpty(),
    check('businessAddress.zip', {title:'Error', description:'Zip code is required.'}).not().isEmpty(),
    check('warehouseAddress.street', {title:'Error', description:'Street is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.aptSuite', {title:'Error', description:'Apt/Suite is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.city', {title:'Error', description:'City is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.state', {title:'Error', description:'State is required.'}).not().isEmpty().optional({nullable: true}),
    check('warehouseAddress.zip', {title:'Error', description:'Zip code is required.'}).not().isEmpty().optional({nullable: true}),
    check('phone', {title:'Error', description:'Valid phone is required.'}).isNumeric(),
    check('email', {title:'Error', description:'Valid email is required.'}).isEmail(),
  ], validationHandler],
  async (req, res) => {
    apiLogger.debug('User requesting to update company with account information', {
      params: req.params || '',
      query: req.query || '',
      body: req.body || ''
    })

    const {
      email,
      phone,
      businessAddress,
      warehouseAddress,
      account,
    } = req.body;

    // Check if company already has account setup
    let queryStartTime = new Date()

    apiLogger.debug('Searching DB for company data', {collection: 'companies', operation: 'read'})

    let company = await Company.findById(req.params.companyId)

    apiLogger.debug('Found company record', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    if (company.operation !== null && company.operation!== undefined) {
      return res.status(400).json({ errors: [{ msg: {title: 'Error', description: 'Account already exists.'} }] })
    }

    try {

      company.operation = account;
      company.addressBusiness = businessAddress;
      company.addressWarehouse = warehouseAddress;
      company.email = email;
      company.phoneWork = phone;

      queryStartTime = new Date()
      apiLogger.info('Updating company record in DB with account data', {collection: 'companies', operation: 'read'})
      await company.save();
      apiLogger.info('Company record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


      // Send company ID with response object (used for adding company to user record)
      httpContext.set('resDocs', 1);
      apiLogger.debug('Sending company id')
      return res.send(company);

    } catch (err) {
      console.log(err);
      apiLogger.error('Caught error')

      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

// @route   PUT api/companies/adduser
// @desc    Add user to company
// @access  Has company

router.put(
  '/adduser', [userAuth,companyAuth]
  ,
  async (req, res) => {
    apiLogger.debug('User requesting to update company with user data', {
      params: req.params || '',
      query: req.query || '',
      body: req.body || ''
    })


    // Check if user is already added to company
    let queryStartTime = new Date()
    apiLogger.debug('Searching DB for company data', {collection: 'companies', operation: 'read'})

    let company = await Company.findById(req.user.company);
    apiLogger.debug('Company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    let foundUser = [];

    company.users.forEach((record) => {
      if (record.user.toString() === req.user._id.toString()) {
        foundUser.push(record);
      }
    });

    if (foundUser.length >0) {
      apiLogger.warn('User already exists in company record')
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'User is already part of company.'} }] });
    }

    // Add user to company
    try {
      newUser = {
        user: req.user._id
      }

      company.users.push(newUser);

      queryStartTime = new Date()
      apiLogger.debug('Updating company record with user data in DB', {collection: 'companies', operation: 'update'})

      await company.save();

      apiLogger.debug('Company record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      return res.status(200).json({ msg: {title: 'Success', description: 'User added to company!'} })
      ;

    } catch (err) {
      console.log(err);
      apiLogger.error('Caught error');
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

module.exports = router;