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

// passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/', viewRouter);

module.exports = app;


"#$fxc3EeNW4cbFg^cY@J"