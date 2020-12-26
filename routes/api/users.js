const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { genPassword } = require('../../lib/passwordUtils')
const invitationCheck = require('../../middleware/invitationCheck');
const User = require('../../models/User');
const Company = require('../../models/Company');
const Invitation = require('../../models/Invitation');

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
      return res
      .status(400)
      .json({ errors: errors.array() });
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
        ],
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

// @route   POST api/users
// @desc    Register User with invitation link
// @access  public

router.post(
  '/:companyId/:docId',
  [
    invitationCheck,
    [
    check('firstName', {title:'Error', description:'First name is required'}).not().isEmpty(),
    check('lastName', {title:'Error', description:'Last name is required'}).not().isEmpty(),
    check('email', {title:'Error', description:'Valid email is required'}).isEmail(),
    check(
      'password',
      {title: 'Error', description: 'Please enter a password with 6 or more characters'}
    ).isLength({ min: 6 })
  ]],
  async (req, res) => {
    // Check input fields for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    const { companyId } = req.params;

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
        company: companyId,
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
        ],
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
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }
);


// @route   PUT api/users/:companyId
// @desc    Add company to user
// @access  public

router.put(
  '/addCompany/:companyId',
  async (req, res) => {
    
    // Check if company exists
    let company = Company.findById(req.params.companyId);

    if(!company) {
      return res
        .status(400)
        .json({ errors: [{msg: {title: 'Error', description: 'Company not added to user.' } }] })
    }

    try {
      // Check if user exists

      let user = await User.findById(req.user._id);

      console.log('found user: ', user);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }

      // If user record already has a company, company can't be changed
      if (user.company !== null && user.company !== undefined) {
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User already has a company.'} }] });
      }

      user.company = req.params.companyId;

      await user.save();

      return res
      .status(200)
      .json({msg: {title: 'Success', description: 'Company added to user.'}})

    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/:companyId
// @desc    Add company to user
// @access  public

router.put(
  '/addCompany',
  async (req, res) => {

    const { code } = req.body;
    
    // Check if company exists
    let invitation = await Invitation.findOne({code});

    if(!invitation) {
      return res
        .status(400)
        .json({ errors: [{msg: {title: 'Error', description: 'Invalid code submitted.' } }] })
    }

    // Check if code is expired
    let now = new Date();
    let isValid = invitation.expires.getTime() > now.getTime();

    if (!isValid) {
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'Invitation link is expired.'} }] });
    }

    try {
      // Check if user exists

      let user = await User.findById(req.user._id);

      console.log('found user: ', user);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }

      // If user record already has a company, company can't be changed
        if (user.company !== null && user.company !== undefined) {
          return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'User already has a company.'} }] });
        }


      user.company = invitation.company;

      await user.save();

      return res
      .status(200)
      .json({msg: {title: 'Success', description: 'Company added to user.'}})

    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }
);




module.exports = router;
