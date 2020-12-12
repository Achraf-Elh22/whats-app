const express = require('express');

// utils
const { ensureAuthUi, ensureGuestUi } = require('../middlewares/auth');

// Controllers
const { signup, login, profile, verify, contact } = require('../controllers/viewController');

const router = express.Router();

// Route /signUp' (STAGE 2)
// desc GET signUp View
router.get('/signup', ensureGuestUi, signup);

// Route /verify' (STAGE 2)
// desc GET verify View
router.get('/verify', ensureGuestUi, verify);

// Route /verify' (STAGE 2)
// desc GET profile View
router.get('/profile', ensureGuestUi, profile);

// Route /login'
// desc GET logIn View
router.get('/login', ensureGuestUi, login);

// Route /contact'
// desc GET contact View
// router.get('/contact', ensureAuthUi, contact);
router.get('/contact', contact);

module.exports = router;
