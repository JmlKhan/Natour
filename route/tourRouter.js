const express = require('express');
const tourController = require('../controller/tourController');
const router = express.Router();
const authController = require('./../controller/authController');
const reviewController = require('./../controller/reviewController');

//router.param('id', tourController.checkID);
router.route('/top-alias').get(tourController.topAlias, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-tours'), tourController.deleteTour);

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
