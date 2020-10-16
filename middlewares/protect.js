const { isSessionExpired } = require('../utils/validation');

exports.verify = async (req, res, next) => {
  let user = req.session.newUser;
  // Check if there is user data in session
  if (!user)
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please signup first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });
  // check if the user post his Otp
  if (!req.body.otp || isNaN(req.body.otp))
    return res.status(401).json({
      status: 'Error',
      message: `Please Provide a valid OTP code`,
    });

  // Check if the Session expired

  if (isSessionExpired(req.session, user.initDate))
    return res.status(401).json({
      status: 'Error',
      message: `Time Out, Please re-signup Again at ${req.protocol}://${req.headers.host}/api/v1/user/signup`, // Find another message to show
    });

  next();
};
