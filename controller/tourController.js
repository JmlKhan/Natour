const fs = require('fs');
const { truncate } = require('fs/promises');
const Tour = require('./../models/tourModel');

exports.topAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverag,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

exports.getAllTours = async(req, res) => {
try{
  //build query
  // 1.filtering
  const queryObj = {...req.query};
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(el => delete queryObj[el]);
  
  // 2.Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Tour.find(JSON.parse(queryStr))

  //Sorting
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log(sortBy)
    query = query.sort(req.query.sort);
    //sort('price ratingsAverage')
  }else {
    query = query.sort('-createdAt')
  }
  //limiting field
  if(req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }else{
    query = query.select('-__v');
  }

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);

  if(req.query.page) {
    const numTours = await Tour.countDocuments();
    if(skip >= numTours) throw new Error('This page does not exist');
  }

  ////execute query
  const tours = await query;
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
