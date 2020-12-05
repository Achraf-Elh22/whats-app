const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/userModel');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../config/index');

module.exports = (passport) => {
  // Verification using Email and Passport
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        await User.findOne({ 'profile.email': username }, async (err, user) => {
          if (err) done(err);

          if (!user) return done(null, false, { message: 'Incorrect Email or password' });

          const validPassword = await user.validPassword(password);

          if (!validPassword) {
            return done(null, false, { message: 'Incorrect Email or password' });
          }
          return done(null, user);
        });
      } catch (err) {
        return done(err);
      }
    })
  );
  //Verification using Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/user/auth/google/redirect',
      },
      async (accessToken, refreshToken, profile, done) => {
        let userEmail = profile.emails[0].value;

        let user = await User.findOne({ 'profile.email': userEmail });

        if (user) {
          done(null, user);
        } else {
          done(null, false, { message: 'There is no user with this email' });
        }
      }
    )
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
