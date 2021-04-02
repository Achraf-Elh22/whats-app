const express = require('express');
const auth = require('../middlewares/auth');

const initialData = require('../utils/initialData');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // For development purposes
    // const id = '6037a170d10990042799807b';
    const id = req.user.id;

    const data = await initialData(id);

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
