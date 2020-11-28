const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionStore = require('../../config/db');
const session = require('express-session');
const db = require('../../config/db');
const nodemailer = require('nodemailer');

const User = require('../../models/User');

// @route   GET api/auth
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

// @route   GET api/auth/logout
// @desc    Logout user
// @access  public

router.get('/logout', (req,res) => {
  console.log('//* GET/AUTH *// logging out')
  req.session.destroy();
})

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

    const sessionsCollection = sessionStore.db.collection('sessions');

  // Returns cursor for sessions containing user id
  sessionsCollection.find({session: new RegExp(req.user._id)}, (err, sessions) => {
    if(sessions !== null) {

      // Form an array from cursor
      sessions.toArray((a, sessionsData) => {

        // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
        sessionsData.forEach((element, index) => {
          const data = JSON.parse(element.session);
          if (element._id !== req.session.id) {
            sessionStore.destroy(element._id, (err, data) => {
              if (err) 
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
                res.jasonp({status: 'Previous Session Deleted'})
            })
          }
        })
      })
    } else {
      res.jsonp({ status: 'No Session Found'});
    }
    console.log("found sessions: ", sessions);
  })

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


router.post('/', passport.authenticate('local'), async (req,res) => {

  const sessionsCollection = sessionStore.db.collection('sessions');

  // Returns cursor for sessions containing user id
  sessionsCollection.find({session: new RegExp(req.user._id)}, (err, sessions) => {
    if(sessions !== null) {

      // Form an array from cursor
      sessions.toArray((a, sessionsData) => {

        // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
        sessionsData.forEach((element, index) => {
          const data = JSON.parse(element.session);
          if (element._id !== req.session.id) {
            sessionStore.destroy(element._id, (err, data) => {
              if (err) 
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
                res.jasonp({status: 'Previous Session Deleted'})
            })
          }
        })
      })
    } else {
      res.jsonp({ status: 'No Session Found'});
    }
    console.log("found sessions: ", sessions);
  })
  
  // Remove local credentials of user from memory before returning
  console.log('//* POST/AUTH *// loggin in')
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
