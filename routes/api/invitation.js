const express = require('express');
const router = express.Router();
const { createInvitations } = require('./controllers/invitations');

// Middleware
const { check } = require('express-validator');
const companyAuth = require('../../middleware/companyAuth');
const userAuth = require('../../middleware/userAuth');
const authorize = require('../../middleware/authorize');
const validationHandler = require('../../middleware/validationHandler')
const sanitizeBody = require('../../middleware/sanitizeBody');


// @route   POST api/invitation
// @desc    Create invitations
// @access  Has company, has 'Invitations':'Create' permission

router.post('/',
[userAuth, companyAuth, authorize('Admin', 'Invitations', 'Create'), sanitizeBody, [
  check('emails.*', { title: 'Error', description: 'Please enter a valid email address' }).isEmail()
], validationHandler], createInvitations)

module.exports = router;