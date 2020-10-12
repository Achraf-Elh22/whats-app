exports.signup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
    formTitle: 'Create a New Account',
    formId: 'newUser',
  });
};

exports.verify = (req, res, next) => {
  console.log(req.session.newUser);
  res.status(200).render('verify', {
    title: 'Verify',
    formTitle: `Verify ${req.session.newUser.phoneNumber}`,
    formId: 'digit-group',
  });
};

exports.verify;

exports.login = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log In',
    formTitle: 'Login to Your Account',
  });
};
