const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validPassword = require('../lib/passwordUtils').validPassword;

require('dotenv').config();


const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      console.log('PASSPORT VERIFY CALLBACK CALLED');
      User.findOne({ email: username })
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

  
  passport.use('google-register',
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/register-callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('===== GOOGLE PROFILE =======')
    console.log(profile)
    console.log('======== END ===========')
    
    const {id, name, emails} = profile;
    
    User.findOne({email: emails[0].value}).then((user) => {
      if (!user) {
        
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
        console.log('Generated new user to be saved: ', newUser);
        newUser.save();
        console.log('New user saved.');
        // res.json({msg: {title: 'Success', description: 'User created! You may log in.'}})
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
    console.log('===== GOOGLE PROFILE =======')
    console.log(profile)
    console.log('======== END ===========')
    
    const { id, emails } = profile;
    
  try {

    const userById = await User.findOne({'google.googleId':id}).select('-local.hash -local.salt')
    const userByEmail = await User.findOne({email:emails[0].value}).select('-local.hash -local.salt')

    console.log('User By Id: ', userById)
    console.log('User By Email: ', userByEmail)

    if(userById) {
      console.log('Found User by ID, Loggin In...:', userById)
      return done(null, userById);
    }

    if(!userById && userByEmail) {
      const user = await User.findOneAndUpdate({email:emails[0].value},
        {$set: {'google.googleId':id, isVerified: true}})

      console.log('Found User by Email, Adding Google ID:', user)

      return done(null, user)
    }
    if (!userById) {
      console.log('There is no account associated with this email, please create an account.');
      return done(null, false, {message: 'There is no account associated with that email.'})
    }
    
  } catch (error) {
    return done(error);
  }
  })
  )
  
  passport.serializeUser((user, done) => {
    console.log('Serialize user:', user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('PASSPORT DESERIALIZE CALLED');
    console.log('Deserialize user:', id);

    User.findById(id).select('-local.hash -local.salt')
    .then(user => {done(null, user);}
    ).catch(err => done(err))
  });

}
