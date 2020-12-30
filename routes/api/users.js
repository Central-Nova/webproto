const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { genPassword } = require('../../lib/passwordUtils')
const invitationCheck = require('../../middleware/invitationCheck');
const User = require('../../models/User');
const Company = require('../../models/Company');
const Invitation = require('../../models/Invitation');


// @route   GET api/users
// @desc    Get all users by company
// @access  public
router.get('/', async (req, res) => {


  if(!req.user.company) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You are not part of a company.'} }] });
}
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
// @access  public
router.get('/department/:department', async (req, res) => {

  const validDepartments = ['sales', 'products', 'warehouse', 'fleet', 'payments'];

   if (!validDepartments.includes(req.params.department.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid department entered.'} }] });

   }

  if(!req.user.company) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You are not part of a company.'} }] });
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
// @access  public
router.get('/role/:role', async (req, res) => {

  const validroles = ['manager', 'worker'];

   if (!validroles.includes(req.params.role.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid role entered.'} }] });

   }

  if(!req.user.company) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You are not part of a company.'} }] });
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
// @access  public
router.get('/department/:department/role/:role', async (req, res) => {

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

  if(!req.user.company) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'You are not part of a company.'} }] });
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
            }
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
  '/company',
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
      return res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/users/company
// @desc    Add company to user with invitation code
// @access  public

router.put(
  '/roles/:userId',
  async (req, res) => {

    // Check if provided roles are correct
    let rolesData = req.body

    // Loop through to make sure it has three keys and validate

    let keysToCheck = ['department', 'manager', 'worker']

    console.log('keyToCheck: ', keysToCheck);

    // Data validation
    for (let role in rolesData) {
      
      // Check if the role object has three keys
      keysToCheck.forEach( key => {
        if (rolesData[role].hasOwnProperty(key)) {
          return
        } else {
          console.log('problem key');
        }

      })

      // Check if each department is a string
      if (typeof rolesData[role].department !== 'string') {
        console.log('problem: ', typeof rolesData[role].department)
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each manager is boolean
      if (typeof rolesData[role].manager !== 'boolean') {
        console.log('problem: ', typeof rolesData[role].manager)

        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });

      }

      // Check if each worker is boolean
      if (typeof rolesData[role].worker !== 'boolean') {
        console.log('problem: ', typeof rolesData[role].worker)

        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User roles could not be updated with provided data.'} }] });
    }

    }

    try {

      let user = await User.findById(req.params.userId);

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
      }

      user.roles = rolesData

      user.save();

      return res.status(200).json({msg: {title: 'Success!', description: `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}'s roles has been updated.`}});

    } catch (err) {

      return res.status(500).send('Server Error');
      
    }
    // set roles

    // save

    
  }
);




module.exports = router;
