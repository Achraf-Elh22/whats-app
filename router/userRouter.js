const express = require('express');

// Controllers
const { signup, verify, profile, login } = require('../controllers/userController');

const validation = require('../middlewares/validation');
const protect = require('../middlewares/protect');
const { generateCode, send, saveUserInSession, uploadPhoto } = require('../middlewares/utils');

const router = express.Router();

// Route /api/v1/user/signUp (STAGE 1)
// desc POST FORM INFO FOR SIGNUP => Phone, Email, Password
router.post('/signup', validation.signup, saveUserInSession, generateCode, send, signup);

// Router /api/v1/user/verify (STAGE 2)
// Desc POST verify the user by send OTP code via Email or Phone number
router.use(protect.signIn);

router.post('/verify', send, verify);

router.post('/send', (req, res, next) => {
  const sendIt = true;
  const user = req.session.newUser;
  user.sendBy === req.body.sendBy;
  send(req, res, next, sendIt);
});

// Router /api/v1/user/profile (STAGE 3)
// Desc POST Create the user profile
router.post('/profile', uploadPhoto.single('photo'), profile);

// Route /api/v1/user/logIn
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', login);

module.exports = router;
