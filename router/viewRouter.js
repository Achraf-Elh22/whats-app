const express = require('express');

// Controllers
const { signup, login } = require('../controllers/viewController');

const router = express.Router();

// Route /signUp'
// desc GET signUp View
router.get('/signup', signup);

// Route /logIn'
// desc GET logIn View
router.get('/login', login);

module.exports = router;
