const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');

//middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: 'Cant find url on this server'
  // })

  const err = new Error(`Cant find ${req.originalUrl} on this server`)
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
})

app.use( (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
})

module.exports = app;
