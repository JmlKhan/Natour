const fs = require('fs');
const Tour = require('./../models/tourModel');





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
exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};
exports.updateTour = (req, res) => {
  
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
