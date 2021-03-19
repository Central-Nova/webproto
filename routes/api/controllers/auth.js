const httpContext = require('express-http-context');
const apiLogger = require('../../../config/loggers');
const passport = require('passport');
const sessionStore = require('../../../config/db');

const passportUtils = {
  deleteExistingSessions: async (userId, sessionId) => {
    apiLogger.debug('deleting existing sessions');;
    const sessionsCollection = sessionStore.db.collection('sessions');
    // Returns cursor for sessions containing user id
    try {
      let sessions = await sessionsCollection.find({session: new RegExp(userId)})
  
      if (sessions) {
        sessions.toArray((a, sessionsData) => {
          
          // Loop through each item in sessions array. If it doesn't have the same session ID as the current session ID, then destroy the session
          sessionsData.forEach((element, index) => {
            if (element._id !== sessionId) {
              sessionStore.destroy(element._id, (err, data) => {
                if (err) {
                } 
              })
            }
          })
        })
      }
  
      return true
    } catch (error) {
      return false
    }
  },

  passportCallback: (req, res, next) => (err, user, info) => {
    apiLogger.debug('begin passport authenticate (auth)');
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
      apiLogger.debug('called req.logIn (auth)');
    if (err) { 
      apiLogger.error('Passport login failed')
      res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] });
      return next(err); 
    }
    return;
    });
    
    let sessionDeleteSuccess = passportUtils.deleteExistingSessions(req.user._id, req.session.id);

    if (!sessionDeleteSuccess) {
      return res
      .status(400)
      .json({ errors: [{ msg: {title:'Error', description:'Server Error' }}] })    
    }
  
  // Remove local credentials of user from memory before returning
  // let cleanUser = cleanUserObject(req.user);

  apiLogger.debug('User successfully authenticated (auth)')

  return res
  .status(200)
  .json({msg: {title: 'Success', description: 'Logged in!'}})
}
}

// Login user
const loginUser = (req, res, next) => {
  apiLogger.debug('User requesting authentication', {
    params: req.params || '',
    query: req.query || '',
    body: req.body || ''
  })
  passport.authenticate('local', passportUtils.passportCallback(req,res,next))(req,res,next)
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
  loginUser,
  passportUtils
}