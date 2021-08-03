const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Routers
const userRouter = require('./router/userRouter');
const viewRouter = require('./router/viewRouter');
const contactRouter = require('./router/contactRouter');

// configs
require('./config/passport')(passport);

const { NODE_ENV } = require('./config/index.js');

const app = express();

// http Logger
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewears
// body Parse
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

const sessionOptions = {
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, maxAge: 30 * 86400 * 1000 },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash('success_msg');
  res.locals.error = req.flash('error_msg');
  next();
});

// passport
app.use(passport.initialize());
app.use(passport.session());

// Auto Login in development model
// This middleweare is only for development purposes development
if (NODE_ENV === 'development' && process.argv[2] === '--auto-auth') {
  app.use((req, res, next) => {
    const user = {
      photo: 'user-1',
      description: 'Every new day is a chance to change your life.',
      _id: '6037a170d10990042799807b',
      email: 'user-1@exemple.com',
      username: 'rosa welch',
      phoneNumber: '+441632960065',
      createdAt: '2021-02-25T13:09:04.546Z',
      updatedAt: '2021-02-25T13:09:04.546Z',
      id: '6037a170d10990042799807b',
    };
    req.logIn(user, function (err) {
      if (err) {
        req.flash('error_msg', err);
        return next(err);
      }

      const success_msg = 'Your are logged in';
      req.flash('success_msg', success_msg);

      next();
    });
  });
}
// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/', viewRouter);

module.exports = app;
