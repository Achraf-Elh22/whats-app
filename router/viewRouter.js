const express = require('express');

// Controllers
const { signup, login, profile, verify } = require('../controllers/viewController');

const router = express.Router();

// Route /signUp' (STAGE 2)
// desc GET signUp View
router.get('/signup', signup);

// Route /verify' (STAGE 2)
// desc GET verify View
router.get('/verify', verify);

// Route /verify' (STAGE 2)
// desc GET profile View
router.get('/profile', profile);

// Route /logIn'
// desc GET logIn View
router.get('/login', login);

module.exports = router;
