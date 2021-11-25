const {promisify} = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
});
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
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
    
    createSendToken(user, 200, res);
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

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    }
}

exports.forgotPassword = catchAsync( async (req, res, next) => {

    //1. Get user based on email
    const user = await User.findOne({ email: req.body.email});
    if(!user) {
        return next( new AppError('There is no user with email address.', 404));
    }

    //2. Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3.Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password> Submit a PATCH request with your new password and
    passwordConfirm to: ${resetURL}.\nIf you didnt forget your password, please ignore this email`;
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token valid for 10min.',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next( new AppError('there was an error sending the email. Try again later!', 500))
    }
    
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    console.log(req.params.token)
    //1. get user based on token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now()}
    });

    //2. if token has not expired and there is user, set new password
   if(!user) {
        return next(new AppError('Token is invalid or has expired'), 400)
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync ( async (req, res, next) => {
    //1. Get userfrom collection
    const user = await User.findById(req.user.id).select('+password');
       
    //2. check if posted current password is correct
    if( !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next( new AppError('Your current password is wrong.', 401))
    }

    //3. if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({validateBeforeSave: false});

    //4.log user in, sent JWT
    createSendToken(user, 200, res);
    
})