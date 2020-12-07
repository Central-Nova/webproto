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
  async (req, res) => {

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
          .json({ errors: [{ msg: 'company already exists' }] });
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

      // Create json webtoken for company

    } catch (err) {
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
