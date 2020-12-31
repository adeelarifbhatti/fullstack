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

/*exports.checkCourseProperties = (req,res,next) => {
		if(!req.body.name || !req.body.difficulty || !req.body.duration){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid name or difficulty or duration'
		});
	};
	next();
};*/
exports.getCourses = async (req,res) => {

	try{
		const queryObj = {...req.query};
		const excludingValues = ['page','sort','limit','fields'];
		excludingValues.forEach(el=>delete queryObj[el]);

		const query =  Course.find(queryObj);
		const courses = await query;
		console.log(req.query, queryObj);
		res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
	}
	catch(err){
		res.status(404).json({
			status: 'fail',
			message: err

		});
	}

};
exports.addCourse = async (req,res) =>{
	//const newCourse = awaits Course.create(req.body);
	try{
		const newCourse =  new Course(req.body);
	await newCourse.save();
	res.status(200).json({
		ststus: 'success',
		data: {
		course: newCourse
		}
	});
	}
	catch(err){
		res.status(404).json({
			status: 'fail',
			message: err

		});
	}

/*	//console.log(res.body);
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

		});*/
};
exports.getOneCourse = async (req,res) => {
	try {
	const course = await Course.findById(req.params.id);

	res.status(200).json({
		status: 'success',
		data: {
			course
		}
	});
	}
	catch(err){
		res.status(404).json({
			status: 'fail',
			message: err

		});
	}
};
exports.deleteCourse = async (req,res) => {

	try{
		const course = await Course.findByIdAndDelete(req.params.id);

		res.status(204).json({
		status: 'success',
		data: {
			course: null
		}
	});
	}
	catch(err){
		res.status(404).json({
			status: 'fail',
			message: err

		});
	}
};
exports.updateCourse =  async (req,res) => {
	try{
		const course = await Course.findByIdAndUpdate(req.params.id, 
			req.body,{ new: true, runValidators: true});

		res.status(200).json({
		status: 'success',
		data: {
			course: course
		}
	});
	}
	catch(err){
		res.status(404).json({
			status: 'fail',
			message: err

		});
	}

};