const User = require('../models/User');
const bcrypt = require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ username: 'email' }, async (email, password, done) => {
      // Find User
      await User.findOne({ 'local.email': email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
      });

      // Encrypt Password
      const isMatch = await bcrypt.compare(password, user.local.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password is incorrect' });
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
