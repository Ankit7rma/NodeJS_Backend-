/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Check if email password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password'));
  }
  // check if user exists and password exists
  //if everything ok send token to client
  const token = '';
  res.status(200).json({
    status: 'success',
    token,
  });
};
