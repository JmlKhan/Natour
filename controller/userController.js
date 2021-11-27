const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');



const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach( el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

exports.getAllUsers = catchAsync( async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined!',
  });
});
exports.updateMe = catchAsync ( async (req, res, next) => {
  //1. create error if user posts passport data
  if(req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please use updatePassword.', 400)
    )
  }
  //2. filtered out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  
  //3.update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync( async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'success',
    data: null
  })
});
exports.deleteUser = factory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined!',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined!',
  });
};
