//const fs = require('fs');
//const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));

const Course = require('./../models/courseModel');
/*
exports.checkCourseId = (req,res,next,id) => {
		if( req.params.id * 1 > courses.length){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	};
	next();
};
*/

exports.checkCourseProperties = (req,res,next) => {
		if(!req.body.name || !req.body.difficulty || !req.body.duration){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid name or difficulty or duration'
		});
	};
	next();
};
exports.getCourses = (req,res) => {
	res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
};
exports.addCourse = (req,res) =>{
	//console.log(res.body);
	const newId = courses[courses.length -1].id + 1;
	const newCourse = Object.assign({id: newId}, req.body);
	courses.push(newCourse);
	fs.writeFile(`${__dirname}/src/fake-data/data/courses.json`, JSON.stringify(courses),
		err => {
			res.status(201).json({
				status: 'success',
				data: {
					course: newCourse
				}
			});

		});
};
exports.getOneCourse = (req,res) => {
	console.log(req.params);
	const id = req.params.id * 1;

	const course = courses.find(el => el.id === id);

	res.status(200).json({
		status: 'success',
		data: {
			course
		}
	});
};
exports.deleteCourse = (req,res) => {

	res.status(204).json({
		status: 'success',
		data: null
	});
};
exports.updateCourse = (req,res) => {

	res.status(204).json({
		status: 'success',
		data: null
	});
};