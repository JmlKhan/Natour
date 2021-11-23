const {promisify} = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
});
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
      return next( new AppError('Please, provide email and password!', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    
    const token=signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync( async (req, res, next) => {
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next( new AppError('You are not logged in! Please log in to get access.', 401))
    }

    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)

    //checking if user exist
    const currenthUser = await User.findById(decoded.id);
    if(!currenthUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }

    //Check if user changed password after the token was issued
    if (currenthUser.changesPasswordAfter(decoded.iat)) {
        return next( new AppError( 'User recently changed password! Please log in again.', 401))
    }
    //grand access to protected route
    req.user = currenthUser;
    next();
});