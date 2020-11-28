const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth.ensureAuth, (req, res, next) => {
  res.status(501).json({
    status: 'Not Implemented (contact)',
    data: null,
  });
});

module.exports = router;
