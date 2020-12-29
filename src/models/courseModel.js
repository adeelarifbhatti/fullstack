const mongoose = require('mongoose');

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
	}
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