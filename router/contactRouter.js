const express = require('express');
const { ensureAuth } = require('../middlewares/auth');

const initialData = require('../utils/initialData');

const router = express.Router();

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const data = await initialData(req.user.id);

    res.status(200).json({
      status: 'sucess',
      data,
    });
  } catch (err) {
    res.status(501).json({
      status: 'error',
      message: err,
    });
  }
});

// IDEAS:
// Get / => initial data (to be display to user)
// Get /addContact =>  Add contact
// Get /conversations/ =>

module.exports = router;
