const express = require('express');

const router = express.Router();
const tourController = require('../controller/tourControlller');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  // checkId,
  // checkBody,
  aliasTop5Tours,
} = tourController;

router.route('/top5tours').get(aliasTop5Tours, getAllTours);

// router.param('id', checkId);
router.route('/').get(getAllTours).post(
  // checkBody,
  createTour,
);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
