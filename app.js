const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');
const AppError = require('./utils/appError');
const globalError = require('./controller/errorController');

//global middlewares
// Set security http headers
app.use(helmet());


// Limit requests from the same api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this API! Please, try again after 15 minutes...'
});
app.use(limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next( new AppError(`Can't find ${req.originalUrl} on this server`, 404) );
})

app.use(globalError)

module.exports = app;
