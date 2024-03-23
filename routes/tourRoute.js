const express = require('express');
const router = express.Router();
const tourController = require('../controller/tourControlller');
const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourController;

router.param('id', (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
