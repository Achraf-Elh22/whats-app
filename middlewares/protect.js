const { isSessionExpired } = require('../utils/validation');

exports.verify = async (req, res, next) => {
  let user = req.session.newUser;
  // Check if there is user data in session

  if (!user)
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please signup first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });

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

  // check if the user post his Otp

  if (!req.body.otpCode || isNaN(req.body.otpCode))
    return res.status(401).json({
      status: 'Error',
      message: `Please Provide a valid Verify code`,
    });
  next();
};
