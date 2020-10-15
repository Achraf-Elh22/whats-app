const { verifyToken } = require('../utils/utils');

exports.verify = async (req, res, next) => {
  let user = req.session.newUser;
  // Check if there is user data in session
  if (!user)
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
    });
  // check if the user post his Otp
  if (!req.body.otp || isNaN(req.body.otp))
    return res.status(401).json({
      status: 'Error',
      message: `Please Provide a valid OTP code`,
    });

  // Check if the token in Session is valid
  const decodeToken = await verifyToken(user.token);

  if (!decodeToken)
    return res.status(401).json({
      status: 'Error',
      message: `unauthorized, Please login first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`, // Find another message to show
    });

  next();
};
