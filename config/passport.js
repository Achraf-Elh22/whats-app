const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require('../models/userModel');
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = require("../config/index")

module.exports = (passport) => {
  // Verification using Email and Passport
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
    //Verification using Google
  passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/v1/user/auth/google/redirect"
  },async (accessToken,refreshToken,profile,done)=>{
    
    let newUser = {
      googleId: profile.id,
      photo: profile.photos[0].value,
      email:profile.emails[0].value,
      
    };

    let user = await User.findOne({"profile.googleId":newUser.googleId});
    if(user) {
      done(null,user);
    }else{
      // if you notice i set the passpord staticly it's because of the architecture of process of signin
       newUser = await User.create({"profile":{...newUser,username:newUser.email.split("@")[0],password:"062208892adfdfsdfds"}});
      done(null, newUser);
    }
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};



