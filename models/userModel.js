/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
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
    validate: [validateEmail, 'Please provide a valid Email'],
  },
  photo: String, // Optional field for user photo
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (value) {
        // Regular expression to match password criteria
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
      },
      message:
        'Password must have at least 8 characters, contain a capital letter, a lowercase letter, and a number',
    },
    // You can add additional password validation such as minimum length, etc.
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirmation is required'],
    validate: {
      // Custom validator function to check if passwordConfirm matches password only works in save and create
      validator: function (value) {
        return value === this.password; // Returns true if passwordConfirm matches password
      },
      message: 'Password confirmation does not match password',
    },
    // You can add additional validation to ensure passwordConfirm matches password
  },
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
