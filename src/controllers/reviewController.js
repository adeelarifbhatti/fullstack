const tryCatch = require('./../lib/tryCatch');
const Review = require('./../models/reviewModel');
const appErrors = require('./../lib/appErrors');

exports.getAllReviews = tryCatch(async(req,res,next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });

});
exports.createReview = tryCatch(async(req,res,next)=>{
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });

});