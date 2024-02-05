const express = require('express');
const router = express.Router();

const tourController = require('../controlers/tourController');

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  // checkBody,
} = tourController;

// router.param('id', tourController.checkId);

// Create a checkbody middleware that check if the body contains the name and price property if not send back 400 (bad request ) , add it to the post handler stack
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan, getAllTours);

router.route('/tours-stats').get(getTourStats);
router.route('/').get(getAllTours).post(
  // checkBody,
  createTour
);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
