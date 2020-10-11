const express = require('express');

// Controllers
const { signup, login } = require('../controllers/userController');

const signupValidation = require('../middlewares/signupValidation');

const router = express.Router();

// Route /api/v1/user/signUp'
// desc POST FORM INFO FOR SIGNUP => Phone, Email, Password
router.post('/signup', signupValidation, signup);

// Route /api/v1/user/logIn'
// desc POST FORM INFO FOR Login => Phone, Password
router.post('/login', login);

module.exports = router;
