const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validPassword = require('../lib/passwordUtils').validPassword;

const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      console.log('PASSPORT VERIFY CALLBACK CALLED');
      User.findOne({ 'local.email': username })
        .then((user) => {
          // Wrong Email
          if (!user) { return done(null, false) }
          
            console.log('Found User:', user.local);

            const isValid = validPassword(password, user.local.hash, user.local.salt);

            if (isValid) {
                return done(null, user);
            } else {
            // Wrong Password
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('PASSPORT DESERIALIZE CALLED');
    User.findById(id).select('-local.hash -local.salt')
    .then(user => {done(null, user);}
    ).catch(err => done(err))
  });

}