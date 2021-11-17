const fs = require('fs');
const Tour = require('./../models/tourModel');



exports.checkBody = (req, res, next) => {
  // if (!req.body.name || !req.body.price) {
  //   return res.status(400).json({
  //     status: 'bad request',
  //     message: 'missing  name or price',
  //   });
  // }
  next();
};

exports.getAllTours = (req, res) => {
  // res.json({
  //   status: 'success',
  //   result: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};
exports.getTour = (req, res) => {
  
  
  // res.json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};
exports.createTour = (req, res) => {
  
};
exports.updateTour = (req, res) => {
  
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
