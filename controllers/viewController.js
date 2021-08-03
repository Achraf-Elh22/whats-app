const { isSessionExpired } = require('../utils/validation');
const { diffTime, errorRes } = require('../utils/utils');
const initialData = require('../utils/initialData');

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
    formTitle: 'Create a New Account',
    formId: 'newUser',
  });
};

exports.verify = (req, res) => {
  let user = req.session.newUser;
  // Check if there is user data in session and if the user is in the right stage
  if (!user || user.stage !== 'verify')
    return res
      .status(401)
      .render(
        'error',
        errorRes(
          401,
          'Sign Up First',
          'Unauthorized, Please Sign Up First',
          `${req.protocol}://${req.headers.host}/signup`,
          'Sign up'
        )
      );

  if (isSessionExpired(req.session, user.expDate)) {
    return res
      .status(401)
      .render(
        'error',
        errorRes(
          401,
          'TIMEOUT',
          'Unauthorized, Please Resign Up',
          `${req.protocol}://${req.headers.host}/signup`,
          'Resign up'
        )
      );
  }

  if (user.consecutiveFailure >= 3)
    return res
      .status(401)
      .render(
        'error',
        errorRes(
          401,
          'YOU MADE ALOT OF ATTEMPTS ',
          'You made alot of attempts, Please re-Check your informatiin by re-sign',
          `${req.protocol}://${req.headers.host}/signup`,
          'Resign up'
        )
      );

  // Timer
  const formatTime = diffTime(user.expDate).format;
  const formatPhoneNumber = req.session.newUser.phoneNumber.match(/.{1,4}/g).join(' ');
  res.status(200).render('verify', {
    title: 'Verify',
    formTitle: `Verify ${user.sendBy === 'SMS' ? formatPhoneNumber : user.email}`,
    formId: 'digit-group',
    remainTime: formatTime,
    sendBy: user.sendBy === 'SMS' ? 'EMAIL' : 'SMS',
  });
};

exports.profile = (req, res, next) => {
  let user = req.session.newUser;
  // Check if there is user data in session and if the user is in the right stage
  if (!user || user.stage !== 'createProfile')
    return res
      .status(401)
      .render(
        'error',
        errorRes(
          401,
          'Sign Up First',
          'Unauthorized, Please Sign Up First',
          `${req.protocol}://${req.headers.host}/signup`,
          'Sign up'
        )
      );

  res.status(200).render('profile', {
    title: 'Create Profile',
    formId: 'profile',
    formTitle: 'Create Your Profile',
  });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
    formTitle: 'Login to Your Account',
    formId: 'login',
  });
};

// Initial data need to render Contact page
exports.initData = async (req, res, next) => {
  try {
    const id = req.user.id;

    if (!id) {
      return res
        .status(401)
        .render(
          'error',
          errorRes(
            501,
            'Sign Up First',
            'Unauthorized, Please Sign Up First',
            `${req.protocol}://${req.headers.host}/signup`,
            'Sign up'
          )
        );
    }
    req.init = await initialData(id);
    next();
  } catch (err) {
    res.status(500).json({ status: 'error', message: err });
  }
};

exports.contact = (req, res, next) => {
  return res.status(200).render('contact', {
    title: 'CONTACT',
    data: req.init,
  });
};
