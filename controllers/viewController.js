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
  // Check if there is user data in session
  if (!user)
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

  // Timer
  const formatTime = diffTime(user.expDate).format;
  const formatPhoneNumber = req.session.newUser.phoneNumber.match(/.{1,4}/g).join(' ');
  res.status(200).render('verify', {
    title: 'Verify',
    formTitle: `Verify ${formatPhoneNumber}`,
    formId: 'digit-group',
    remainTime: formatTime,
  });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
    formTitle: 'Login to Your Account',
  });
};
