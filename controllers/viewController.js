exports.signup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
    formTitle: 'Create a New Account',
    formId: 'newUser',
  });
};
exports.login = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log In',
    formTitle: 'Login to Your Account',
  });
};
