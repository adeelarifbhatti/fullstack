const mongoose = require('mongoose');
const Course = require('./courseModel');
const courseModel = require('./courseModel');
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

},
{
	toJSON: {virtuals: true},
	toObject: {virtuals: true}
});
reviewSchema.pre(/^find/, function(next){
    // too much data in virtual populate, it was nexted and populating alot
    /*this.populate({
        path: 'course',
        select: 'name'
    }),*/
    this.populate({
        path: 'user',
        select: 'name'
    });
    next();
});
reviewSchema.statics.calAverageRating = async function(courseId){
    const stat = await this.aggregate([
    {
        $match: {course: courseId}
    },
    {
        $group: {
            _id: '$course',
            nrating: {$sum: 1},
            avgRating: { $avg: '$rating'}            
        }
    }

    ]);
    console.log("From calAverageRating reviewModel ",stat);
    if( stat.length >0){
    await courseModel.findByIdAndUpdate(courseId, {
        averageRating: stat[0].avgRating,
        quantityRating: stat[0].nrating
    });
    }
    else {
    await courseModel.findByIdAndUpdate(courseId, {
        averageRating: 0,
        quantityRating: 4.5
        });

    }
};
reviewSchema.post('save', function(){
    this.constructor.calAverageRating(this.course);
});
// findByIdAndUpdate or Delete
reviewSchema.pre(/^findOneAnd/,async function(next){
    // This would not work in post because bythen the query would already been executed and we won't find
    //findOne
    // storing the model object in the this.r so that we can pass into the next middleware
     this.r = await this.findOne();
     next();
});
reviewSchema.post(/^findOneAnd/, async function(){
    await this.r.constructor.calAverageRating(this.r.course);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;