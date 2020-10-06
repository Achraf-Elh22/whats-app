const express = require('express');
const path = require('path');
const morgan = require('morgan');

// Routers
const userRouter = require('./router/userRouter');

const { NODE_ENV } = require('./config/index.js');

const app = express();

// http Logger
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Template engine
app.set('views engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/user/', userRouter);

module.exports = app;
