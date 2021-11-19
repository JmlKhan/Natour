const fs = require('fs');
const { truncate } = require('fs/promises');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//middleware
exports.topAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverag,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}



exports.getAllTours = async(req, res) => {
try{
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
}catch(err) {
  res.status(404).json({
    status: 'fail',
    message: err
  })
}
  
};
exports.getTour = async (req, res) => {
   try{
    const tour = await Tour.findById(req.params.id);

    res.json({
      status: 'success',
      data: {
        tour,
      },
    });
   }catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
   }
  
  
};
exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
        runValidators: true
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};
exports.updateTour = async (req, res) => {
  try{
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
  }catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
 try{
  const tour = await Tour.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data:{
      tour: 'data has been deleted successfully!'
    },
  });
 }catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
  })
 } 
};

exports.getTourStats = async (req, res) => {
  try{
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
  }catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
  })
 } 
}
