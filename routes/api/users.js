const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { genPassword, validPassword } = require('../../lib/passwordUtils')

const User = require('../../models/User');

// @route   GET api/users
// @desc    Get user id from req.user
// @access  public
router.get('/', (req, res) => {

  console.log('//* GET: API/AUTH *// get user', req.user);

  if(!req.user) {
    return res.status(401).send('No User');
  }

  try {
    return res.send(req.user);
    } catch (error) {
    return res.status(500).send('Server Error');
  }
})


// @route   POST api/users
// @desc    Register User
// @access  public

router.post(
  '/',
  [
    check('firstName', {title:'Error', description:'First name is required'}).not().isEmpty(),
    check('lastName', {title:'Error', description:'Last name is required'}).not().isEmpty(),
    check('email', {title:'Error', description:'Valid email is required'}).isEmail(),
    check(
      'password',
      {title: 'Error', description: 'Please enter a password with 6 or more characters'}
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // Check input fields for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;


    try {
      // Check for existing user

      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'User already exists'} }] });
      }

      user = new User({
        firstName,
        lastName,
        email,
        roles: [
          {
            department: 'Sales',
            role: 'Worker'
          },
          {
            department: 'Products',
            role: 'Worker'
          },
          {
            department: 'Warehouse',
            role: 'Worker'
          },
          {
            department: 'Fleet',
            role: 'Worker'
          },
          {
            department: 'Payments',
            role: 'Worker'
          },
        ]
      });

      // Create password hash

      const { salt, hash } = genPassword(password);

      user.local.salt = salt;
      user.local.hash = hash;

      await user.save();

      return res
      .status(200)
      .json({msg: {title: 'Success', description: 'User created! You may log in.'}})

    } catch (err) {
      return res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/:companyId
// @desc    Add company to user
// @access  public

router.put(
  '/:companyId',
  async (req, res) => {

    try {
      // Check for existing user

      let user = await User.findById(req.user._id);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }

      user.company = req.params.companyId;

      await user.save();

      return res
      .status(200)
      .json({msg: {title: 'Success', description: 'Company added to user.'}})

    } catch (err) {
      return res.status(500).send('Server Error');
    }
  }
);


module.exports = router;
