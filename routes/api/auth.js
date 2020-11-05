const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get user data
// @access  public

// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-local.password');
//     return res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
//   res.json({message:'from api/user',...req.user})
// });

// @route   GET api/auth/google
// @desc    Authenticate user & get token
// @access  public

router.get('/google/login', passport.authenticate('google-login', { scope: ['email','profile'] }))

// @route   GET api/auth/
// @desc    Authenticate user & get token
// @access  public

router.get('/google/register', passport.authenticate('google-register', { scope: ['email','profile'] }))

// @route   GET api/auth
// @desc    Authenticate user & get token
// @access  public

router.get(
	'/google/login-callback',
	passport.authenticate('google-login')
)

router.get(
	'/google/register-callback',
	passport.authenticate('google-register', {
		successRedirect: '/',
		failureRedirect: '/'
	})
)


// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  public


router.post('/', passport.authenticate('local'), (req,res) => {
  // let userInfo = {
  //   username: req.user
  // };
  // console.log('Successfully Logged In:', req.user);
  // res.json({data: req.user});

  console.log('POST to /login')
  const user = JSON.parse(JSON.stringify(req.user)) // hack
  const cleanUser = Object.assign({}, user)
  if (cleanUser.local) {
    console.log('LOGIN POST ROUTE DELETING SALT AND HASH')
    delete cleanUser.local.hash;
    delete cleanUser.local.salt;
  }
  console.log("cleanUser:", cleanUser)
  res.json(cleanUser)
});

module.exports = router;
