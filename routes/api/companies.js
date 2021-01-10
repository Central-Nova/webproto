const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');

const Company = require('../../models/Company');
const User = require('../../models/User');

// @route   GET api/companies
// @desc    get Company
// @access  public

router.get(
  '/',[companyAuth], async (req, res) => {

    try {

      // Check for existing company

      let company = await Company.findById(req.user.company);

      if (!company) {
        return res
          .status(401)
          .json({ errors: [{ msg: {title: 'Error', description: 'Company not found.'}  }] });
      }

      return res.send(company)


    } catch (err) {
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
    [check('businessName', {title:'Error', description:'Please enter your business Name.'}).not().isEmpty(),
    check('ein', {title:'Error', description:'Please enter a valid EIN.'}).isNumeric().isLength({min: 8}),
  ],
  async (req, res) => {

    // Handle validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() })
    }

    const {
      businessName,
      ein,
    } = req.body;

    try {

      // Check for existing company by owner

      let companyOwner = await Company.findOne({owner: req.user._id})
      
      if (companyOwner) {
        return res
        .status(400)
        .json({errors: [{ msg: {title: 'Error', description: 'You already have a company.'}}]})
      }

      // Check for existing company by EIN

      let companyEin = await Company.findOne({ ein });

      if (companyEin) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Company already exists.'}  }] });
      }

      console.log('req.body: ', req.body);

      company = new Company({
        name: businessName,
        owner: req.user.id,
        ein,
        users: [{
          user: req.user.id
        }]
      });

      console.log('company: ', company);
      await company.save();

      // Send company ID with response object (ised for adding company to user record)
      return res.status(200).json(company._id);

    } catch (err) {
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
 [ companyAuth,[
    check('phone', {title:'Error', description:'Valid phone is required.'}).isNumeric(),
    check('email', {title:'Error', description:'Valid email is required.'}).isEmail(),
  ]],
  async (req, res) => {

    // Handle validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() })
    }

    const {
      email,
      phone,
      businessAddress,
      warehouseAddress,
      account,
    } = req.body;
    console.log('req.body: ', req.body);

    // Check if company already has account setup

    let company = await Company.findById(req.params.companyId)

    if (company.operation !== null && company.operation!== undefined) {
      return res.status(400).json({ errors: [{ msg: {title: 'Error', description: 'Account already exists.'} }] })
    }

    try {

      company.operation = account;
      company.addressBusiness = businessAddress;
      company.addressWarehouse = warehouseAddress;
      company.email = email;
      company.phoneWork = phone;

      console.log('company: ', company);
      await company.save();

      // Send company ID with response object (used for adding company to user record)
      return res.status(200).json(company._id);

    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

// @route   PUT api/companies/adduser
// @desc    Add user to company
// @access  Has company

router.put(
  '/adduser', [companyAuth]
  ,
  async (req, res) => {


    // Check if user is already added to company
    let company = await Company.findById(req.user.company);
    
    let foundUser = [];

    company.users.forEach((record) => {
      if (record.user.toString() === req.user._id.toString()) {
        foundUser.push(record);
      }
    });

    if (foundUser.length >0) {
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
      await company.save();

      // Send company ID with response object (used for adding company to user record)
      return res.status(200).json({ msg: {title: 'Success', description: 'User added to company!'} })
      ;

    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

module.exports = router;
