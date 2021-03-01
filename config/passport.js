const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validPassword = require('../lib/passwordUtils').validPassword;
const sanitize = require('mongo-sanitize');
const apiLogger = require('../config/loggers')

require('dotenv').config();


const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

      apiLogger.info('Querying database...')
      User.findOne({ email: username })
        .then((user) => {
          apiLogger.info(`User ${user._id} found`)

          // Wrong Email
          if (!user) { return done(null, false) }
          
          apiLogger.info(`Validating user credentials...`)
            const isValid = validPassword(password, user.local.hash, user.local.salt);

            if (isValid) {
              apiLogger.info(`User successfully validated`)
              return done(null, user);
            } else {
            // Wrong Password
            apiLogger.error(`User credentials invalid`)
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

    })
  );

  
  passport.use('google-register',
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/register-callback'
  },
  (accessToken, refreshToken, profile, done) => {
    apiLogger.info('Google authentication returned Google profile')
    const {id, name, emails} = profile;

    apiLogger.info('Querying database...')
    User.findOne({email: emails[0].value}).then((user) => {
      if (!user) {
        apiLogger.info('No matching user found, initializing user...')
        const newUser = new User({
          firstName: name.givenName,
          lastName: name.familyName,
          email: emails[0].value,
          google: {
            googleId: id,
          },
          isVerified: true,
          roles: [
            {
              department: 'Sales',
              role: 'Worker'
            },
            {
              department: 'Products',
              role: 'Worker'
            },
            {
              department: 'Warehouse',
              role: 'Worker'
            },
            {
              department: 'Fleet',
              role: 'Worker'
            },
            {
              department: 'Payments',
              role: 'Worker'
            },
          ]
        });
        newUser.save();
        apiLogger.info(`User ${newUser._id} created`)

        return done(null);
      } else {
        return done(null)
      }
      
    }
    ).catch((err) => {
      done(err)
    })
  })
  )

  passport.use('google-login',
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/login-callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    apiLogger.info('Google authentication returned Google profile')

    const { id, emails } = profile;
    
  try {
    apiLogger.info('Querying database...')
    const userById = await User.findOne({'google.googleId':id}).select('-local.hash -local.salt')
    const userByEmail = await User.findOne({email:emails[0].value}).select('-local.hash -local.salt')

    if(userById) {
      apiLogger.info('Found Google ID in database, logging in')
      return done(null, userById);
    }

    if(!userById && userByEmail) {
      const user = await User.findOneAndUpdate({email:emails[0].value},
        {$set: {'google.googleId':id, isVerified: true}})
      apiLogger.info('Found existing local user, added google email')

      return done(null, user)
    }
    if (!userById) {
      apiLogger.error('Google account not found in database')
      return done(null, false, {message: 'There is no account associated with that email.'})
    }
    
  } catch (error) {
    return done(error);
  }
  })
  )
  
  passport.serializeUser((user, done) => {
    apiLogger.info('Serializing user ID')
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    apiLogger.info('Deserializing user ID')
    User.findById(id).select('-local.hash -local.salt')
    .then(user => {done(null, user);}
    ).catch(err => done(err))
  });

}
