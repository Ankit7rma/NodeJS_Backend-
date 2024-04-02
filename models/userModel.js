/* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable import/no-extraneous-dependencies */
// const mongoose = require('mongoose');

// const { isEmail } = require('validator');

// // Custom email validation function
// const validateEmailFormat = function (email) {
//   // Regular expression to match a stricter email format
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// // Define the User schema
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     validate: [
//       {
//         validator: isEmail,
//         message: 'Please provide a valid email address',
//       },
//       {
//         validator: validateEmailFormat,
//         message: 'Please provide a valid email address',
//       },
//     ],
//   },
//   photo: String, // Optional field for user photo
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Password must be at least 8 characters long'],
//     validate: {
//       validator: function (value) {
//         // Regular expression to match password criteria
//         return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
//       },
//       message:
//         'Password must have at least 8 characters, contain a capital letter, a lowercase letter, and a number',
//     },
//     // You can add additional password validation such as minimum length, etc.
//   },
//   passwordConfirm: {
//     type: String,
//     required: [true, 'Password confirmation is required'],
//     validate: {
//       // Custom validator function to check if passwordConfirm matches password only works in save and create
//       validator: function (value) {
//         return value === this.password; // Returns true if passwordConfirm matches password
//       },
//       message: 'Password confirmation does not match password',
//     },
//     // You can add additional validation to ensure passwordConfirm matches password
//   },
// });

// // Create and export the User model
// const User = mongoose.model('User', UserSchema);
// module.exports = User;

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const { isEmail } = require('validator');

// Custom email validation function
const validateEmailFormat = function (email) {
  // Regular expression to match a stricter email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [
      {
        validator: isEmail,
        message: 'Please provide a valid email address',
      },
      {
        validator: validateEmailFormat,
        message: 'Please provide a valid email address',
      },
    ],
  },
  photo: String, // Optional field for user photo
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation is required'],
    validate: {
      validator: function (value) {
        return value === this.password; // Returns true if passwordConfirm matches password
      },
      message: 'Password confirmation does not match password',
    },
  },
});

// Hash and salt the password before saving to the database
UserSchema.pre('save', async function (next) {
  // Check if password is modified
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);

    // Clear the passwordConfirm field as it's no longer needed
    this.passwordConfirm = undefined;

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
