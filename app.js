const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');

//middlewares
app.use(express.json());
app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
