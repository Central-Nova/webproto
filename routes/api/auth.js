const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionStore = require('../../config/db');
const httpContext = require('express-http-context');
const userAuth = require('../../middleware/userAuth');
const { getAuthUser, logout, loginUser, passportUtils } = require('./controllers/auth');

// @route   GET api/auth
// @desc    Get user id from req.user
// @access  public
router.get('/',[userAuth], getAuthUser)

// @route   GET api/auth/logout
// @desc    Logout user
// @access  public

router.get('/logout', logout )

// @route   GET api/auth/google
// @desc    Login user with Google OAuth
// @access  public

router.get('/google/login', passport.authenticate('google-login', { scope: ['email','profile'] }))

// @route   GET api/auth/google/register
// @desc    Register user with Google OAuth
// @access  public

router.get('/google/register', passport.authenticate('google-register', { scope: ['email','profile'] }))

// @route   GET api/auth/google/login-callback
// @desc    Google OAuth login callback
// @access  public

router.get(
	'/google/login-callback',
	passport.authenticate('google-login'), (req, res) => {

  let sessionDeleteSuccess = passportUtils.deleteExistingSessions(req.user._id, req.session.id);

  if (!sessionDeleteSuccess) {
    return res
    .status(400)
    .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] })
  }
    res.redirect('http://localhost:3000/dashboard');
  }
)

// @route   GET api/auth/google/register-callback
// @desc    Google OAuth register callback
// @access  public

router.get(
	'/google/register-callback',
	passport.authenticate('google-register', {
		successRedirect: 'http://localhost:3000',
		failureRedirect: 'http://localhost:3000'
	}))


// @route   POST api/auth
// @desc    Local Authentication callback
// @access  public

router.post('/', loginUser);

module.exports = router;
