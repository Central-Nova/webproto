const httpContext = require('express-http-context');
const apiLogger = require('../../../config/loggers');
const { genPassword } = require('../../../lib/passwordUtils')
const User = require('../../../models/User');
const Company = require('../../../models/Company');
const Invitation = require('../../../models/Invitation');


// Register User
const registerUser = async (req, res) => {

  apiLogger.debug('User requesting to create new user record', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  const { firstName, lastName, email, password } = req.body;

  try {
    // Check for existing user

    let queryStartTime = new Date();
    apiLogger.debug('Searching db for existing user record', {collection: 'users',operation: 'read'})
    let user = await User.findOne({ email });

    if (user) {
      apiLogger.debug('Existing user record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User already exists'} }] });
    }
    apiLogger.debug('No existing user record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})


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

    queryStartTime = new Date();
    apiLogger.info('Creating new user record in db', {collection: 'users',operation: 'create'})
    await user.save();
    apiLogger.info('Created new user record', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'User created! You may log in.'}})

  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

// Register user with invitation link
const registerUserWithLink = async (req, res) => {

  apiLogger.debug('User requesting to create new user with invitation link', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })


  const { firstName, lastName, email, password } = req.body;
  const { companyId } = req.params;

  try {
    

    // Check for existing user
    let queryStartTime = new Date();
    apiLogger.debug('Searching db for existing user record', {collection: 'users',operation: 'read'})
    let user = await User.findOne({ email });
    
    if (user) {
      apiLogger.debug('Existing user record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})
      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User already exists'} }] });
    }
    apiLogger.debug('No existing user record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})


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

    queryStartTime = new Date();
    apiLogger.info('Creating new user record in DB ', {collection: 'users',operation: 'create'})
    await user.save();
    apiLogger.info('New user record created in DB', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'User created! You may log in.'}})

  } catch (err) {
    apiLogger.error('Caught error');
    console.log(err);
    return res.status(500).send('Server Error');
  }
}

// Get all users by company
const getUsersByCompany = async (req, res) => {

  apiLogger.debug('User requesting all user records by company', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
 
  try {
    let queryStartTime = new Date();
    apiLogger.info('Searching db for users by company', {collection: 'users',operation: 'read'})
    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

    if (!users) {
      apiLogger.debug('No user records found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'No users found'} }] });
    }

    apiLogger.info('User records found', {documents: users.length, responseTime: `${new Date() - queryStartTime}ms`})

    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending user records by company', {documents: users.length})
    return res.send(users);
    } catch (error) {
      apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

// Get users by department
const getUsersByDepartment = async (req, res) => {

  const validDepartments = ['sales', 'products', 'warehouse', 'fleet', 'payments'];

   if (!validDepartments.includes(req.params.department.toLowerCase())) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid department entered.'} }] });

   }

  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

    if (!users) {
      console.log('no users found')
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'No users found'} }] });
    }
 
    
    users = users.filter(user => {
      let departmentCheck = user.roles.map(role => role.department.toLowerCase() === req.params.department.toLowerCase())
      return departmentCheck.includes(true);
    })

    return res.send(users);
    } catch (error) {
      return res.status(500).send('Server Error');
  }
}

// Get users by role
const getUsersByRole = async (req, res) => {

  const validroles = ['manager', 'worker'];

   if (!validroles.includes(req.params.role.toLowerCase())) {
    console.log('invalid role')
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invalid role entered.'} }] });

   }

  try {

    let users = await User.find({company: req.user.company}).select('-local.hash -local.salt')

    if (!users) {
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'No users found'} }] });
    }
 
    users = users.filter(user => {
      let roleCheck = user.roles.map(role => role[req.params.role])
      return roleCheck.includes(true);
    })

    return res.send(users);
    } catch (error) {
    return res.status(500).send('Server Error');
  }
}

// Get users by department and role
const getUsersByDepartmentandRole = async (req, res) => {

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

    if (!users) {
      console.log('no users found')
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'No users found'} }] });
    }
 
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
}

// Add company to user
const addCompanyToUser = async (req, res) => {
  apiLogger.debug('Requesting to update user record with company data', {
    body: req.body,
    params: req.params,
    query: req.query
  })

  
  // Check if company exists
  let queryStartTime = new Date();
  apiLogger.debug('Searching db for company record', {collection: 'companies',operation: 'read'})
  let company = Company.findById(req.params.companyId);
  
  if(!company) {
    apiLogger.debug('No company record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
    return res
    .status(400)
    .json({ errors: [{msg: {title: 'Error', description: 'Company not added to user.' } }] })
  }

  apiLogger.debug('Company record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

  try {
    // Check if user exists
    queryStartTime = new Date();
    apiLogger.debug('Searching db for user record', {collection: 'user',operation: 'read'})
    let user = await User.findById(req.user._id);

    if (!user) {
      apiLogger.debug('No user record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})
      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
    }
    apiLogger.debug('user record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    // If user record already has a company, company can't be changed
    if (user.company !== null && user.company !== undefined) {
      apiLogger.debug('User record already has a company');
      return res
      .status(400)
      .json({ errors: [{ msg: {title: 'Error', description: 'User already has a company.'} }] });
    }

    user.company = req.params.companyId;

    queryStartTime = new Date();
    apiLogger.info('Updating user record', {collection: 'user',operation: 'update'})
    await user.save();
    apiLogger.info('User record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Company added to user.'}})

  } catch (err) {
  //   if (err.kind =='ObjectId') {
  //     return res
  //     .status(400)
  //     .json({ errors: [{ msg: {title: 'Error', description: 'Company not found.'} }] });
  // }
    apiLogger.error('Caught error');
     res.status(500).send('Server Error');
  }
}

// Add company to user with invitation code
const addCompanyToUserWithCode = async (req, res) => {
  apiLogger.debug('Requesting to update user record with invitation code', {
    body: req.body,
    params: req.params,
    query: req.query
  })

  const { code } = req.body;
  
  // Check if invitation exists
  let queryStartTime = new Date();
  apiLogger.debug('Searching db for invitation record', {collection: 'invitations',operation: 'read'})

  let invitation = await Invitation.findOne({code});

  if(!invitation) {
    apiLogger.debug('No invitation record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

    return res
      .status(400)
      .json({ errors: [{msg: {title: 'Error', description: 'Invalid code submitted.' } }] })
  }
  apiLogger.debug('Invitation record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


  // Check if code is expired
  let now = new Date();
  let isValid = invitation.expires.getTime() > now.getTime();

  if (!isValid) {
    apiLogge.warn('Invitation code is invalid');
    return res
    .status(400)
    .json({ errors: [{ msg: {title: 'Error', description: 'Invitation link is expired.'} }] });
  }

  try {
    // Check if user exists
    queryStartTime = new Date();
    apiLogger.debug('Searching db for user record', {collection: 'users',operation: 'read'})

    let user = await User.findById(req.user._id);

    if (!user) {
      apiLogger.debug('User record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
    }
    apiLogger.debug('User record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    // If user record already has a company, company can't be changed
      if (user.company !== null && user.company !== undefined) {
        apiLogger.debug('User record already has a company');
        return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'User already has a company.'} }] });
      }

    
    user.company = invitation.company;

    queryStartTime = new Date();
    apiLogger.info('Updating user record with company data in db', {collection: 'users',operation: 'update'})
    await user.save();
    apiLogger.info('User record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    return res
    .status(200)
    .json({msg: {title: 'Success', description: 'Company added to user.'}})

  } catch (err) {
    apiLogger.error('Caught error');
    return res.status(500).send('Server Error');
  }
}

// Edit user roles
const editUserRoles = async (req, res) => {
    
  apiLogger.debug('Requesting to update user roles', {
    body: req.body,
    params: req.params,
    query: req.query
  })


  try {
    let queryStartTime = new Date();
    apiLogger.debug('Searching db for user record', {collection: 'users',operation: 'read'})

    let user = await User.findById(req.params.userId);

    if (!user) {
      apiLogger.debug('No user record found', {documents: 0, responseTime: `${new Date() - queryStartTime}ms`})

      return res
        .status(400)
        .json({ errors: [{ msg: {title: 'Error', description: 'Unauthorized user.'} }] });
    }
    apiLogger.debug('User record found', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})

    user.roles = req.body.roles

    queryStartTime = new Date();
    apiLogger.info('Updating user roles in db', {collection: 'users',operation: 'update'})
    user.save();
    apiLogger.info('User record updated', {documents: 1, responseTime: `${new Date() - queryStartTime}ms`})


    return res.status(200).json({msg: {title: 'Success!', description: `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}'s roles has been updated.`}});

  } catch (err) {
    apiLogger.error('Caught error');
    console.log('err: ', err);
    return res.status(500).send('Server Error');
  }
}

module.exports = {
  registerUser,
  registerUserWithLink,
  getUsersByCompany,
  getUsersByRole,
  getUsersByDepartment,
  getUsersByDepartmentandRole,
  addCompanyToUser,
  addCompanyToUserWithCode,
  editUserRoles
}