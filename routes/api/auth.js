const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionStore = require('../../config/db');

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


// @route   GET api/auth
// @desc    Get user id from req.user
// @access  public
router.get('/', (req, res) => {

  sessionStore.all((error, sessions) => {
    console.log('//* GET: API/AUTH *// sessionStore.all: ', sessions)
  })
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

// @route   GET api/auth/logout
// @desc    Login user with Google OAuth
// @access  public

router.get('/logout', passport.authenticate('google-login', { scope: ['email','profile'] }))


// @route   GET api/auth/google
// @desc    Login user with Google OAuth
// @access  public

router.get('/google/login', (req,res) => {
  console.log('//* GET/AUTH *// logging out')
  req.logout();
})

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
    res.redirect('http://localhost:3000/dashboard');
  }
)

// @route   GET api/auth/google/register-callback
// @desc    Google OAuth register callback
// @access  public

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
