const express = require('express');
const router = express.Router();
const { getRoles, getRolesByDocument, editRoles } = require('./controllers/roles');

// Middleware
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const { check} = require('express-validator')
const validationHandler = require('../../middleware/validationHandler');
const sanitizeBody = require('../../middleware/sanitizeBody');


// @route   GET api/roles
// @desc    Get roles
// @access  Has company

router.get(
  '/'
  , [userAuth, companyAuth], getRoles
);

// @route   GET api/roles/document/:document
// @desc    Get roles by document type
// @access  Has company

router.get(
  '/document/:document'
  , [userAuth, companyAuth], getRolesByDocument
);


// @route   PUT api/users/company
// @desc    Edit company role permissions
// @access  Has company and has 'Role Permissions':'Edit' permission

router.put(
  '/department/:department', [userAuth, companyAuth, authorize('Admin', 'Role Permissions', 'Edit'), sanitizeBody, [
    check('permissions.*.department').not().isEmpty(),
    check('permissions.*.document').not().isEmpty(),
    check('permissions.*.action').not().isEmpty(),
    check('permissions.*.manager').not().isEmpty().isBoolean(),    
    check('permissions.*.worker').not().isEmpty().isBoolean(),
  ], validationHandler], editRoles
);


module.exports = router;
