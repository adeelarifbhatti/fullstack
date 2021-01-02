const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Course name is required'],
		unique: true
	},
	duration:{
		type: Number,
		required: [true,'Course duration must be entered']
	},
	difficulty:{
		type: String,
		required: [true, 'difficulty level must be selected']
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
	description: {
		type: String,
		required: [true, 'Description must be entered']
	},
	slug: {
		type: String,

	},
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
courseSchema.pre('save', function(next){
	this.slug = slugify(this.name, {lower: true});
	next();
});
courseSchema.post('save', function(course, next){
	console.log("Slug for this course is ",this.slug);
	next();
});
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