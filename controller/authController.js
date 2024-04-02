/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exists and password exists
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Invalid Email or Password'));
  }

  const token = signToken(user._id);
  //if everything ok send token to client

  res.status(200).json({
    status: 'success, Signed in',
    token,
  });
});
