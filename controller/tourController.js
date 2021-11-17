const fs = require('fs');
const { truncate } = require('fs/promises');
const Tour = require('./../models/tourModel');





exports.getAllTours = async(req, res) => {
try{
  const tours = await Tour.find()
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
