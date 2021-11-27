const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

//middleware
exports.topAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverag,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = catchAsync(async(req, res, next) => {
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
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews')
    
    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    }); 
});




exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
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
