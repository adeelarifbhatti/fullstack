const tryCatch = require('./../lib/tryCatch');
const Review = require('./../models/reviewModel');
const appErrors = require('./../lib/appErrors');
const factoryHandler = require('./../controllers/factoryHandler');


exports.getAllReviews = tryCatch(async(req,res,next) => {
        // thanks to mergeParams
    let filter = {};
    if(req.body.courseId) filter = {course: req.params.courseId};
    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });

});
exports.setIDs = tryCatch( async(req,res,next)=>{
    // thanks to mergeParams
    //if these parameters are not in the body then initializing them
    if(!req.body.course) req.body.course = req.params.courseId;
    if(!req.body.user) req.body.user = req.user.id;
    next();    
});
exports.deleteReview = factoryHandler.deleteOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
exports.createReview = factoryHandler.CreateOne(Review);