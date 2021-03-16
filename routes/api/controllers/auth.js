const httpContext = require('express-http-context');
const apiLogger = require('../../../config/loggers');
const passport = require('passport');
const sessionStore = require('../../../config/db');


// Login user
const loginUser = (req, res, next) => {
  console.log('res: ', res.statusCode);
  apiLogger.debug('User requesting authentication', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  passport.authenticate('local', (err, user, info) => {

    // Handle server error
    if (err) { 
      apiLogger.error('Server Error', {
        event: 'passportjs error'
      })
      res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] });

      return next(err); }

    // Handle "no user" from passport
    if (!user) { 
      apiLogger.warn('Authentication failed.')
      return res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Invalid Credentials' }}] })
    };

      // Call passport login
      req.logIn(user, (err) => {
      if (err) { 
        apiLogger.error('Passport login failed')
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
        
        // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
        sessionsData.forEach((element, index) => {
          if (element._id !== req.session.id) {
            sessionStore.destroy(element._id, (err, data) => {
              if (err) {
              } 
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
    delete cleanUser.local.hash;
    delete cleanUser.local.salt;
  }
  apiLogger.debug('User successfully authenticated')

  return res
  .status(200)
  .json({msg: {title: 'Success', description: 'Logged in!'}})
  })(req,res,next)
}

// Return user object
const getAuthUser = (req, res) => {
  console.log('calling getauthuser');
  apiLogger.debug('Requesting user data', {
    body: req.body,
    params: req.params,
    query: req.query
  })

  try {
    httpContext.set('resDocs', 1);
    apiLogger.debug('Sending user data')
    return res.send(req.user);
    } catch (error) {
      console.log('error: ', error);
      apiLogger.error('Caught error')
      return res.status(500).send('Server Error');
  }
}

// Destroy user session
const logout = (req,res) => {
  try {
    req.session.destroy();
  } catch (error) {
  }
}

module.exports = {
  getAuthUser,
  logout,
  loginUser
}