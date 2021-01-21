const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Course name is required'],
		unique: true,
		trim: true,
		maxlength: [40, 'Must not exceed 15 characters'],
		minlength: [5, 'Must nto be less than 5 characters']
	},
		// referencing 
	teacher: [
		{
		type: mongoose.Schema.ObjectId,
		ref: 'User'
		}
	],
	duration:{
		type: Number,
		required: [true,'Course duration must be entered']
	},
	
	deActivated:{
		type: Boolean,
		default: false
	},
	difficulty:{
		type: String,
		required: [true, 'difficulty level must be selected'],
		enum: {
			values: ['easy','intermediate','Hard'],
			message: 'difficulty must be either easy,hard or difficulty'
		}
	},
	level: {
		type: String,
		required: [true, 'level must be entered']
	},
	seats:{
		type: Number,
		required: [true, 'Number of seats must be entered']
	},
	prerequisite:{
		type: String,
		required: [true, 'prerequisite must be entered']
	},
	fee: {
		type: Number,
		required: [true, 'Fee of the course must be entered']
	},
	averageRating: { 
		type: Number
	},
	quantityRating: { 
		type: Number
	},

	discount: {
		type: Number,
		validate:{
		validator: function(val){			
			return val < this.fee

			},
			message: 'Discount ({VALUE}) should be less than the fee'

		}
	},
	description: {
		type: String,
		required: [true, 'Description must be entered']
	},
	slug: {
		type: String,

	},/*
	This is how it is done in child referencing
	reviews: [{ type: mongoose.Schema.ObjectId,
		ref: 'Review' }],
		*/
	mainImage: {
		type: String,
		required: [true, 'Image must be entered']
	},
	images: [String],
	
	offeredDate: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date]

},

{
	toJSON: {virtuals: true},
	toObject: {virtuals: true}
});
courseSchema.virtual('Weeks').get(function(){
	return this.duration / 7;

});
// Virtual Populate
courseSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'course',
	localField: '_id'
	
});
//Index for duration to speedup the search 
courseSchema.index({duration: 1});

courseSchema.pre('save', function(next){
	this.slug = slugify(this.name, {lower: true});
	next();
});

courseSchema.pre(/^find/, function(next){
	this.find({deActivated: {$ne: true}});
	this.start=Date.now();
	next();
});
courseSchema.post(/^find/, function(doc,next){
	//this.find({deActivated: {$ne: true}});
	console.log('time taken is', Date.now()-this.start, ' milliseconds');
	next();
});
courseSchema.pre('aggregate', function(next){
	this.pipeline().unshift({ $match: {deActivated: {$ne: true}}});
	console.log("Pipeline is ",this.pipeline());
	next();
});
courseSchema.post('save', function(course, next){
	console.log("Slug for this course is ",this.slug);
	next();
});


//Embedding the Teachers in the course, this is not by referencing.
/*
courseSchema.pre('save', async function(next){
	const teacherPromises = this.teacher.map(async id =>await User.findById(id));
	this.teacher = await Promise.all(teacherPromises);
	next();
});
*/
const Course = mongoose.model('Course',courseSchema);
/*
const testCourse = new Course({
	name: 'Network Security',
	duration: '6',
	difficulty: 'Hard'
});
testCourse.save().then(retur =>{console.log(retur);}).catch(err=>{ 
	console.log('Error:', err);
});
*/
module.exports = Course;