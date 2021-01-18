const reviewController = require('../controllers/reviewController'); 
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(reviewController.getAllReviews)
   .post(authController.secure,authController.limitedTo('student'),
        reviewController.createReview);


        module.exports=router;