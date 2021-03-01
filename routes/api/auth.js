const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionStore = require('../../config/db');
const sanitize = require('mongo-sanitize');
const apiLogger = require('../../config/loggers');

// @route   GET api/auth
// @desc    Get user id from req.user
// @access  public
router.get('/', (req, res) => {

  if(!req.user) {
    apiLogger.error('Request Failed: User has not been authenticated.')
    return res.status(401).send('No User');
  }

  try {
    apiLogger.info('Sending user ID to User Agent.')
    return res.send(req.user);
    } catch (error) {
      apiLogger.error('Server Error.')
      return res.status(500).send('Server Error');
  }
})

// @route   GET api/auth/logout
// @desc    Logout user
// @access  public

router.get('/logout', (req,res) => {
  apiLogger.info('Logging out user...')
  try {
    req.session.destroy();
    apiLogger.info('User successfully logged out!')
  } catch (error) {
    apiLogger.error('User log out failed.')
  }
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
        apiLogger.debug(`Found ${sessionsData.length} session(s) belonging to user ${req.user._id}.`)

        // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
        sessionsData.forEach((element, index) => {
          if (element._id !== req.session.id) {
            sessionStore.destroy(element._id, (err, data) => {
              if (err) {
                apiLogger.warn(`Session ${element._id} could not be destroyed.`)
              }
              apiLogger.debug(`Destroyed session ${element._id}.`)
            })
          }
        })
      })
    } else {
      return res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] })
    }
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
		successRedirect: 'http://localhost:3000',
		failureRedirect: 'http://localhost:3000'
	}))


// @route   POST api/auth
// @desc    Local Authentication callback
// @access  public

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    // Handle server error
    if (err) { 
      apiLogger.error('Server Error Encountered')

      res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] });

      return next(err); }

    // Handle "no user found" error
    if (!user) { 
      apiLogger.error('Invalid Credentials')
      return res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Invalid Credentials' }}] })
    };

      // Call passport login
      apiLogger.info('Logging in user with passport.')
      req.logIn(user, (err) => {
      
      if (err) { 
        apiLogger.error('Passport log in failed.')

      res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] });
        return next(err); }
      
      return;
    });

  const sessionsCollection = sessionStore.db.collection('sessions');
  // Returns cursor for sessions containing user id
  sessionsCollection.find({session: new RegExp(req.user._id)}, (err, sessions) => {
    if(sessions !== null) {

      // Form an array from cursor
      sessions.toArray((a, sessionsData) => {
        apiLogger.debug(`Found ${sessionsData.length} session(s) belonging to user ${req.user._id}.`)
        
        // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
        sessionsData.forEach((element, index) => {
          if (element._id !== req.session.id) {
            sessionStore.destroy(element._id, (err, data) => {
              if (err) {
                apiLogger.warn(`Session ${element._id} could not be destroyed.`)
              } 
              apiLogger.debug(`Destroyed session ${element._id}.`)
            })
          }
        })
      })
    } else {
      return res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] })
    }
  })
  
  // Remove local credentials of user from memory before returning
  const reqUser = JSON.parse(JSON.stringify(req.user)) // hack
  const cleanUser = Object.assign({}, reqUser)
  if (cleanUser.local) {
    apiLogger.debug('Local credentials found, deleting local credentials from req.user...')
    delete cleanUser.local.hash;
    delete cleanUser.local.salt;
  }
  return res
  .status(200)
  .json({msg: {title: 'Success', description: 'Logged in!'}})
  })(req,res,next)
});

module.exports = router;
