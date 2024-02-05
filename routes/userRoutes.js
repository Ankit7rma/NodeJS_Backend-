const express = require('express');

const userController = require('../controlers/userController');

const { getAllUsers, getUser, createUser, patchUser, deleteUser } =
  userController;
const router = express.Router();
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
