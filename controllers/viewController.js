const { isSessionExpired } = require('../utils/validation');
const { diffTime } = require('../utils/utils');

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
    return res.status(401).render('error', {
      title: 'Error',
      errorCode: 401,
      errorHeader: 'Sign Up First',
      errorDesc: `Unauthorized, Please Sign Up First`,
      errorLink: `${req.protocol}://${req.headers.host}/signup`,
      errorText: 'sign up',
    });

  if (isSessionExpired(req.session, user.expDate)) {
    return res.status(401).render('error', {
      title: 'Error',
      errorCode: 401,
      errorHeader: 'TIMEOUT',
      errorDesc: `Unauthorized, Please Resign Up `,
      errorLink: `${req.protocol}://${req.headers.host}/signup`,
      errorText: 'Resign up',
    });
  }

  if (user.consecutiveFailure >= 3)
    return res.status(401).render('error', {
      title: 'Error',
      errorCode: 401,
      errorHeader: 'YOU MADE ALOT OF ATTEMPTS ',
      errorDesc: `You made alot of attempts, Please re-Check your informatiin by re-sign`,
      errorLink: `${req.protocol}://${req.headers.host}/signup`,
      errorText: 'Resign up',
    });

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
    return res.status(401).render('error', {
      title: 'Error',
      errorCode: 401,
      errorHeader: 'Sign Up First',
      errorDesc: `Unauthorized, Please Sign Up First`,
      errorLink: `${req.protocol}://${req.headers.host}/signup`,
      errorText: 'sign up',
    });

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

exports.contact = (req, res, next) => {
  return res.status(501).render('error', {
    title: 'Error',
    errorCode: 501,
    errorHeader: 'Not implemented',
    errorLink: `${req.protocol}://${req.headers.host}/signup`,
    errorText: 'sign up',
  });
};
