const fs = require('fs');
const { truncate } = require('fs/promises');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

//middleware
exports.topAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverag,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = catchAsync(async(req, res) => {
  //execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  }); 
});
exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    res.json({
      status: 'success',
      data: {
        tour,
      },
    }); 
});


exports.createTour = catchAsync(async (req, res) => {
  
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
        runValidators: true
      }
    })
  
});
exports.updateTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      status: 'success',
      data: {
        tour: 'Updated tour'
      }
    })
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'success',
    data:{
      tour: 'data has been deleted successfully!'
    },
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: '$difficulty',
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      {
        $match: { _id: {$ne: 'easy'}}
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
});
