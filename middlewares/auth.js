module.exports = {
  ensureAuthUi: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect(`${req.protocol}://${req.headers.host}/signup`);
    }
  },
  ensureGuestUi: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect(`${req.protocol}://${req.headers.host}/contact`);
    } else {
      next();
    }
  },
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({
        status: 'error',
        message: `Please sign or log in first at ${req.protocol}://${req.headers.host}/api/v1/user/signup`,
        data: null,
      });
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(401).json({
        status: 'error',
        message: `You are already login, to access your contact visit this link ${req.protocol}://${req.headers.host}/api/v1/user/contact`,
        data: null,
      });
    } else {
      next();
    }
  },
};
