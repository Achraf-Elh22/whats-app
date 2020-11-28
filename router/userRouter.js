const express = require('express');
const passport = require("passport");

// Controllers
const { signup, verify, profile, login } = require('../controllers/userController');

const validation = require('../middlewares/validation');
const protect = require('../middlewares/protect');
const auth = require('../middlewares/auth');
const {
  generateCode,
  send,
  saveUserInSession,
  uploadPhoto,
  resizeUserPhoto,
} = require('../middlewares/utils');

const router = express.Router();

// Route /api/v1/user/signUp (STAGE 1)
// desc POST FORM INFO FOR SIGNUP => Phone, Email, Password
router.post(
  '/signup',
  auth.ensureGuest,
  validation.signup,
  saveUserInSession,
  generateCode,
  send,
  signup
);

// Router /api/v1/user/verify (STAGE 2)
// Desc POST verify the user by send OTP code via Email or Phone numbers
router.post('/verify', auth.ensureGuest, protect.signIn, send, verify);

router.post('/send', (req, res, next) => {
  const sendIt = true;
  const user = req.session.newUser;
  user.sendBy === req.body.sendBy;
  send(req, res, next, sendIt);
});

// Router /api/v1/user/profile (STAGE 3)
// Desc POST Create the user profile
router.post(
  '/profile',
  auth.ensureGuest,
  protect.signIn,
  uploadPhoto.single('photo'),
  resizeUserPhoto,
  profile
);

// Route /api/v1/user/logIn
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', passport.authenticate("local",{successRedirect:"/api/v1/contact",failureRedirect:"/api/v1/user/login",failureFlash:true}));

router.get("/login",login)

// login by Google 

router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/redirect",passport.authenticate('google',{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
  res.redirect("/contact");
});

module.exports = router;
