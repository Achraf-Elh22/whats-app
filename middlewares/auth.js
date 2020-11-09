module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect(`${req.protocol}://${req.headers.host}/api/v1/user/signup`);
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect(`${req.protocol}://${req.headers.host}/api/v1/user/contact`);
    } else {
      next();
    }
  },
};
