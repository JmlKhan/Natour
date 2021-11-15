const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');

//middlewares
app.use(express.json());
app.use(morgan('dev'));

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
