const express = require('express');
const tourController = require('../controller/tourController');
const router = express.Router();
const authController = require('./../controller/authController');
// const reviewController = require('./../controller/reviewController');
const reviewRouter = require('./../route/reviewRouter');

//router.param('id', tourController.checkID);
router.route('/top-alias').get(tourController.topAlias, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/')
  .get( tourController.getAllTours)
  .post( authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter)

module.exports = router;
