const express = require('express');
const reviewController = require('../controller/reviewController');
const router = express.Router();
const authController = require('./../controller/authController');

router
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect, 
    authController.restrictTo("user", "admin"), 
    reviewController.createReview
     );

module.exports = router; 