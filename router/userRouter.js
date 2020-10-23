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
// Desc POST veerify the suer by send OTP code via Email or Phone number
router.post('/verify', protect.verify, send, verify);

// Route /api/v1/user/logIn
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', login);

module.exports = router;

// TODO
//  - Finish buildin verify process
//! -Solve the probleme wiht email send twice
//  - Pass the User to Stage 3
//  - Build the Stage 3 UI
//  - Handle the Errors of sign up
