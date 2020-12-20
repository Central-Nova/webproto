const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Company = require('../../models/Company');
const User = require('../../models/User');

// @route   GET api/companies
// @desc    get Company
// @access  public

router.get(
  '/'
  ,
  async (req, res) => {


    try {

      // Check for existing company

      if (req.user.company.id !== null) {
        let company = await Company.findById(req.user.company.id);

        if (!company) {
          return res
            .status(401)
            .json({ errors: [{ msg: {title: 'Error', description: 'Company not found by User.'}  }] });
        }

      }

      // Check for existing company

      let company = await Company.findOne({ owner: req.user._id });

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
        ein
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

// @route   PUT api/companies
// @desc    Edit Company
// @access  public

router.put(
  '/:companyId'
  ,
  [
    check('phone', {title:'Error', description:'Valid phone is required.'}).isNumeric(),
    check('email', {title:'Error', description:'Valid email is required.'}).isEmail(),
  ],
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
      operation
      // users
    } = req.body;

    try {

      // Check for existing company by owner

      let company = await Company.findById(req.params.companyId)

      console.log('req.body: ', req.body);

      company[operation] = account;

      company[account] = {
            addressBusiness: businessAddress,
            addressWarehouse: warehouseAddress,
            email,
            phoneWork: phone,
            users: [{
              user: req.user
            }]
          };

      console.log('company: ', company);
      await company.save();

      // Send company ID with response object (ised for adding company to user record)
      return res.status(200).json(company._id);

    } catch (err) {
      console.log(err);
      return res.status(500).json({msg: {title: 'Error', description: 'Server error.'}});
    }
  }
);

module.exports = router;
