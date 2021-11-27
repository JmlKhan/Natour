const Tour = require('./../models/tourModel');
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

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'});
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
