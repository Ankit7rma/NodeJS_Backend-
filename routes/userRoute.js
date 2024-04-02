const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');
const authController = require('../controller/authController');

const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController;
const { signup, login } = authController;

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
