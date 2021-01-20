const reviewController = require('../controllers/reviewController'); 
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router({mergeParams: true });

// post /course/32482348237/reviews, this ID can be accessed by reviewRouter due
// to mergeParams option, i.e. review router gets access to parameter of course's
// ro
router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.secure,authController.limitedTo('student'),
    reviewController.setIDs,reviewController.createReview);

router.route('/:id')
    .get(reviewController.getOneReview)
    .delete(authController.limitedTo('student'),reviewController.deleteReview) 
    .patch(authController.limitedTo('student'),reviewController.updateReview);


module.exports=router;