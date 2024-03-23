const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController;

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
