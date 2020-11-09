const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        await User.findOne({ 'profile.email': username }, (err, user) => {
          if (err) done(err);

          if (!user) return done(null, false, { message: 'Incorrect Email' });

          if (!user.validPassword(password))
            return done(null, false, { message: 'Incorrect Password' });

          return done(null, user);
        });
      } catch (err) {
        return done(err);
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
