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
  '/',
  [
    auth,
    [
      check('name', 'Company name is required').not().isEmpty(),
      check('addressBusiness', 'Business address is required.').not().isEmpty(),
      check('phoneWork', 'Phone number is required.').not().isEmpty(),
      check('ein', 'EIN is required.').not().isEmpty(),
      check('email', 'Email is required').isEmail()
    ]
  ],
  async (req, res) => {
    // Check input fields for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      addressBusiness,
      addressShipping,
      ein,
      email,
      phoneWork,
      phonePersonal,
      phoneFax
      // users
    } = req.body;

    try {
      // Check for existing user

      let company = await Company.findOne({ email });

      if (company) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'company already exists' }] });
      }

      console.log(req.body);

      company = new Company({
        name,
        addressBusiness,
        addressShipping,
        ein,
        email,
        phoneWork,
        phonePersonal,
        phoneFax,
        owner: req.user.id
        // users
      });

      // Figure out how to create the document without all the fields? How are addresses stored in mongodb?

      await company.save();

      // Create json webtoken for company
      const payload = {
        company: {
          id: company.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
