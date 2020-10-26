const express = require('express');

// Controllers
const { signup, verify, login } = require('../controllers/userController');

const validation = require('../middlewares/validation');
const protect = require('../middlewares/protect');
const { generateCode, send, saveUserInSession } = require('../middlewares/utils');

const router = express.Router();

// Route /api/v1/user/signUp'
// desc POST FORM INFO FOR SIGNUP => Phone, Email, Password
router.post('/signup', validation.signup, saveUserInSession, generateCode, send, signup);

// Router /api/v1/user/verify
// Desc POST verify the suer by send OTP code via Email or Phone number
router.use(protect.verify);

router.post('/verify', send, verify);

router.post('/send', (req, res, next) => {
  const sendIt = true;
  const user = req.session.newUser;
  user.sendBy === req.body.sendBy;
  send(req, res, next, sendIt);
});

// Route /api/v1/user/logIn
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', login);

module.exports = router;
