const { isSessionExpired } = require('../utils/validation');

exports.signIn = async (req, res, next) => {
  let user = req.session.newUser;

  // Check if there is user data in session and if the user is in the right stage
  if (!user)
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please signup first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });

  if (user.stage === 'createProfile') next();

  // Check if the Session expired

  if (isSessionExpired(req.session, user.expDate))
    return res.status(401).json({
      status: 'Error',
      message: `Time Out, Please re-signup Again at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });

  // Check if the user did more than 9 attempts

  if (user.consecutiveFailure >= 3)
    return res.status(401).json({
      status: 'Error',
      message: `You made alot of attempts, Please re-Check your informatiin by re-sign in  ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });

  next();
};
