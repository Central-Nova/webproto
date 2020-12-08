const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

const Company = require('../../models/Company');

// @route   POST api/companies
// @desc    Create Company
// @access  public

router.post(
  '/'
  ,
  [
    check('ein', {title:'Error', description:'Please enter a valid EIN.'}).isNumeric().isLength({min: 8}),
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
      businessName,
      ein,
      email,
      phone,
      businessAddress,
      warehouseAddress
      // users
    } = req.body;

    try {
      // Check for existing company

      let company = await Company.findOne({ ein });

      if (company) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Company already exists.'}  }] });
      }

      console.log('req.body: ', req.body);

      company = new Company({
        name: businessName,
        addressBusiness: businessAddress,
        addressWarehouse: warehouseAddress,
        ein,
        email,
        phoneWork: phone,
        owner: req.user.id

      });

      // Figure out how to create the document without all the fields? How are addresses stored in mongodb?

      await company.save();

      return res.status(200).json({msg: {title: 'Success', description: 'Your company has been created!'}})

      // Create json webtoken for company

    } catch (err) {
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
