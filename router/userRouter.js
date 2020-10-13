const express = require('express');

// Controllers
const { signup, verify, login } = require('../controllers/userController');

const signupValidation = require('../middlewares/signupValidation');

const router = express.Router();

// Route /api/v1/user/signUp'
// desc POST FORM INFO FOR SIGNUP => Phone, Email, Password
router.post('/signup', signupValidation, signup);

// Router /api/v1/user/verify
// Desc POST veerify the suer by send OTP code via Email or Phone number
router.post('/verify', verify);

// Route /api/v1/user/logIn'
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', login);

module.exports = router;
