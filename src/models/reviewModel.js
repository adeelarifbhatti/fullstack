const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'A sentence about the course'],
        maxlength: [10, 'Must not exceed more than 10 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'review for a course']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review from a user']
    }

});
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'course',
        select: 'name'
    }),
    this.populate({
        path: 'user',
        salect: 'name'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;