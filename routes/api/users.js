const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { genPassword } = require('../../lib/passwordUtils')
const companyAuth = require('../../middleware/companyAuth');
const authorize = require('../../middleware/authorize');
const invitationCheck = require('../../middleware/invitationCheck');
const sanitize = require('mongo-sanitize');
const sanitizeReq = require('../../lib/sanitize');

// Models
const User = require('../../models/User');
const Company = require('../../models/Company');
const Invitation = require('../../models/Invitation');


// @route   GET api/users
// @desc    Get all users by company
// @access  Has company
router.get('/', [companyAuth], async (req, res) => {


  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

    console.log(users);

    return res.send(users);
    } catch (error) {
    return res.status(500).send('Server Error');
  }
})

// @route   GET api/users/department/:department
// @desc    Get all users by company and department
// @access  Has company
router.get('/department/:department', [companyAuth],async (req, res) => {

  const validDepartments = ['sales', 'products', 'warehouse', 'fleet', 'payments'];

   if (!validDepartments.includes(req.params.department.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid department entered.'} }] });

   }


  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

 
    let usersByDepartment = [];

    // Loop each user
    for (let i in users) {
      let user = users[i];

      // Loop each role
      for (let e in user.roles) {
        let role = user.roles[e];

        if (role.department.toLowerCase() === req.params.department.toLowerCase()) {
          usersByDepartment.push(user);
        } 
      }
    }

    return res.send(usersByDepartment);
    } catch (error) {
      console.log(error);
    return res.status(500).send('Server Error');
  }
})

// @route   GET api/users/department/:department
// @desc    Get all users by company and role
// @access  Has company
router.get('/role/:role', [companyAuth], async (req, res) => {

  const validroles = ['manager', 'worker'];

   if (!validroles.includes(req.params.role.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid role entered.'} }] });

   }

  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

 
    let usersByRole = [];

    // Loop each user
    for (let i in users) {
      let user = users[i];

      // Loop each role
      for (let e in user.roles) {
        let role = user.roles[e];

        if (role.role.toLowerCase() === req.params.role.toLowerCase()) {
          usersByRole.push(user);
        } 
      }
    }

    return res.send(usersByRole);
    } catch (error) {
      console.log(error);
    return res.status(500).send('Server Error');
  }
})

// @route   GET api/users/department/:department
// @desc    Get all users by company, department, and role
// @access  Has company
router.get('/department/:department/role/:role', [companyAuth], async (req, res) => {

  const validDepartments = ['sales', 'products', 'warehouse', 'fleet', 'payments'];
  const validroles = ['manager', 'worker'];

  if (!validDepartments.includes(req.params.department.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid department entered.'} }] });
    }

   if (!validroles.includes(req.params.role.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid role entered.'} }] });
    }

  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

 
    let usersByDepartmentAndRole = [];

    // Loop each user
    for (let i in users) {
      let user = users[i];

      // Loop each role
      for (let e in user.roles) {
        let role = user.roles[e];

        if (
          role.role.toLowerCase() === req.params.role.toLowerCase() && 
          role.department.toLowerCase() === req.params.department.toLowerCase()) {
          usersByDepartmentAndRole.push(user);
        } 
      }
    }

    return res.send(usersByDepartmentAndRole);
    } catch (error) {
      console.log(error);
    return res.status(500).send('Server Error');
  }
})


// @route   POST api/users
// @desc    Register User
// @access  public

router.post(
  '/',[sanitizeReq,
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

    console.log('req.body: ', req.body);

    try {
      // Check for existing user

      let user = await User.findOne({ email });
      console.log('existing user?: ', !!user)

      if (user) {
        console.log('existing user: ', user);

        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'User already exists'} }] });
      }

      console.log('creating user')
      user = new User({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        email,
        roles: [
          {
            department: 'Sales',
          },
          {
            department: 'Inventory',
          },
          {
            department: 'Products',
          },
          {
            department: 'Warehouse',
          },
          {
            department: 'Fleet',
          },
          {
            department: 'Payments',
          },
          {
            department: 'Admin',
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
            department: "Sales",
            manager: false,
            worker: true 
            },
            {
            department: "Products",
            manager: false,
            worker: true 
            },
            {
            department: "Inventory",
            manager: false,
            worker: true 
            },
            {
            department: "Warehouse",
            manager: false,
            worker: true 
            },
            {
            department: "Fleet",
            manager: false,
            worker: true 
            },
            {
            department: "Payments",
            manager: false,
            worker: true 
            },
            {
              department: "Admin",
              manager: false,
              worker: true 
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


// @route   PUT api/users/company/:companyId
// @desc    Add company to user
// @access  public

router.put(
  '/company/:companyId',
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
    //   if (err.kind =='ObjectId') {
    //     return res
    //     .status(400)
    //     .json({ errors: [{ msg: {title: 'Error', description: 'Company not found.'} }] });
    // }
       res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/company
// @desc    Add company to user with invitation code
// @access  public

router.put(
  '/companyInvite',
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
      return res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/company
// @desc    Edit user's roles
// @access  Has company and has 'User Roles':'Edit' permission

router.put(
  '/roles/:userId',[companyAuth, authorize('Admin', 'User Roles', 'Edit'), [
    check('roles.*.department').not().isEmpty(),
    check('roles.*.worker').not().isEmpty().isBoolean(),
    check('roles.*.manager').not().isEmpty().isBoolean(),
    check('roles.*.department').custom(value => ['Sales', 'Products', 'Inventory', 'Warehouse', 'Fleet', 'Payments', 'Admin'].includes(value))

  ]], async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
      .status(400)
      .json({ msg: { title: 'Error', description: 'User roles could not be updated with provided data.' } })
    }

    try {

      let user = await User.findById(req.params.userId);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }

      user.roles = req.body.roles

      user.save();

      return res.status(200).json({msg: {title: 'Success!', description: `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}'s roles has been updated.`}});

    } catch (err) {
      console.log('err: ', err);
      return res.status(500).send('Server Error');
    }
  }
);




module.exports = router;
