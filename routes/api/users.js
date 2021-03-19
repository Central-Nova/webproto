const express = require('express');
const router = express.Router();
const { registerUser,
  registerUserWithLink,
  getUsersByCompany,
  getUsersByRole,
  getUsersByDepartment,
  getUsersByDepartmentAndRole,
  addCompanyToUser,
  addCompanyToUserWithCode,
  editUserRoles } = require('./controllers/users');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const invitationCheck = require('../../middleware/invitationCheck');
const sanitizeBody = require('../../middleware/sanitizeBody');
const validationHandler = require('../../middleware/validationHandler');


// @route   GET api/users
// @desc    Get all users by company
// @access  Has company
router.get('/', [userAuth, companyAuth], getUsersByCompany)

// @route   GET api/users/department/:department
// @desc    Get all users by company and department
// @access  Has company
router.get('/department/:department', [userAuth, companyAuth], getUsersByDepartment)

// @route   GET api/users/role/:role
// @desc    Get all users by company and role
// @access  Has company
router.get('/role/:role', [userAuth, companyAuth], getUsersByRole)

// @route   GET api/users/department/:department
// @desc    Get all users by company, department, and role
// @access  Has company
router.get('/department/:department/role/:role', [userAuth, companyAuth], getUsersByDepartmentAndRole)


// @route   POST api/users
// @desc    Register User
// @access  public

router.post(
  '/',[sanitizeBody,
  [
    check('firstName', {title:'Error', description:'First name is required'}).not().isEmpty(),
    check('lastName', {title:'Error', description:'Last name is required'}).not().isEmpty(),
    check('email', {title:'Error', description:'Valid email is required'}).isEmail(),
    check(
      'password',
      {title: 'Error', description: 'Please enter a password with 6 or more characters'}
    ).isLength({ min: 6 })
  ], validationHandler], registerUser
  
);

// @route   POST api/users
// @desc    Register User with invitation link
// @access  public

router.post(
  '/:companyId/:docId',
  [
    invitationCheck, 
    sanitizeBody,
    [
    check('firstName', {title:'Error', description:'First name is required'}).not().isEmpty(),
    check('lastName', {title:'Error', description:'Last name is required'}).not().isEmpty(),
    check('email', {title:'Error', description:'Valid email is required'}).isEmail(),
    check(
      'password',
      {title: 'Error', description: 'Please enter a password with 6 or more characters'}
    ).isLength({ min: 6 })
  ], 
    validationHandler],
  registerUserWithLink
);


// @route   PUT api/users/company/:companyId
// @desc    Add company to user
// @access  public

router.put(
  '/company/:companyId',
  addCompanyToUser
);

// @route   PUT api/users/company
// @desc    Add company to user with invitation code
// @access  public

router.put(
  '/companyInvite',
  addCompanyToUserWithCode
);

// @route   PUT api/users/company
// @desc    Edit user's roles
// @access  Has company and has 'User Roles':'Edit' permission

router.put(
  '/roles/:userId',[userAuth, companyAuth, authorize('Admin', 'User Roles', 'Edit'), sanitizeBody, [
    check('roles.*.department').not().isEmpty(),
    check('roles.*.worker').not().isEmpty().isBoolean(),
    check('roles.*.manager').not().isEmpty().isBoolean(),
    check('roles.*.department').custom(value => ['Sales', 'Products', 'Inventory', 'Warehouse', 'Fleet', 'Payments', 'Admin'].includes(value))

  ], validationHandler], editUserRoles
);




module.exports = router;
