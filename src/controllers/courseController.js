//const fs = require('fs');
//const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));

const Course = require('./../models/courseModel');
const APIFeatures = require('./../lib/queryString');
const tryCatch = require('./../lib/tryCatch');
const catchError = require('./../lib/catchErrors');

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

exports.topDuration = async (req,res,next) => {
	req.query.limit = 2;
	req.query.sort = '-duration';
	next();
}
exports.getCourses = tryCatch(async (req,res,next) => {

		/* editing the query
		const queryObj = {...req.query};
		const excludingValues = ['page','sort','limit','fields'];
		excludingValues.forEach(el=>delete queryObj[el]);

		//converting the javascript object to string
		let qString = JSON.stringify(queryObj);
		//regex for changing the gte to $gte
		qString = qString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		console.log("#####Query in the URL ######  ", req.query, queryObj, qString);

		// JSON.parse(qString) will convert the text in to javascript object
		let query =  Course.find(JSON.parse(qString));
		*/
		// Sorting

		/*if (req.query.sort){
			console.log("## Sorting########### ",req.query.sort);
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
			console.log("## Sorting########### ",sortBy);
		}
		//default sorting
		else {
			query = query.sort('-duration');
		}
		*/
		//Fields
		/* if(req.query.fields){
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		}
		else{
			query = query.select('-__v');
		}
		*/

		// multiplying will convert to number
		/*const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 4;
		const skip = (page - 1) * limit;

		query = query.skip(skip).limit(limit);

		if(req.query.page){
			const  numCourses = await Course.countDocuments();
			console.log("numCourses ", numCourses, "skip ", skip );
			if(skip > numCourses) throw new Error('This page does not exist');

		}
		*/
		const features = new APIFeatures(Course.find(), req.query)
		.editing().sorting().fields().paginate();
		const courses = await features.query;
		res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
});
exports.addCourse = tryCatch(async (req,res,next) =>{
	//const newCourse = awaits Course.create(req.body);

		const newCourse =  new Course(req.body);
	await newCourse.save();
	res.status(200).json({
		ststus: 'success',
		data: {
		course: newCourse
		}
	});
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
});
exports.getOneCourse = tryCatch(async (req,res,next) => {
	const course = await Course.findById(req.params.id);
	if(!course){
		return next(new catchError('no Course was found', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			course
		}
	});
	});

exports.deleteCourse = tryCatch(async (req,res,next) => {
		const course = await Course.findByIdAndDelete(req.params.id);
		if(!course){
			return next(new catchError('no Course was found', 404));
		}
		res.status(204).json({
		status: 'success',
		data: {
			course: null
		}
	});
});
exports.updateCourse =  tryCatch(async (req,res,next) => {

		const course = await Course.findByIdAndUpdate(req.params.id, 
			req.body,{ new: true, runValidators: true});
		if(!course){
			return next(new catchError('no Course was found', 404));
		}

		res.status(200).json({
		status: 'success',
		data: {
			course: course
		}
	});

});
exports.getBusyMonth =  tryCatch(async (req,res,next) => {

		const year = req.params.year * 1;
		const plan = await Course.aggregate([
		{
			$unwind: '$offeredDate'
		},
		{
		$match: {
			offeredDate: {
				$gte: new Date(`${year}-01-01`),
				$lte: new Date(`${year}-12-31`)
			}
		}
		},
		{
			$group: {
				_id: {$month: '$offeredDate'},
				cCount: {$sum: 1},
				name: {$push: '$name'}
			}
		},
		{
			$addFields: { month:'$_id'}
		},
		{
			$sort: {'cCount':1}
		}	

		]);

		res.status(200).json({
		status: 'success',
		data: {
			plan
		}
	});
	});

exports.getCourseStat =  tryCatch(async (req,res,next) => {


		const stats = await Course.aggregate([
		{
			$match: { seats: {$gte: 50}}
		},
		{
			$group: {
				_id: '$difficulty',
				cCount: {$sum: 1},
				avgFee: { $avg: '$fee'},
				avgSeats: {$avg: '$seats'},
				minFee: {$min: '$fee'},
				maxFee: {$max: '$fee'},
					}
		},
		{
				$sort: { avgFee: 1}
		}/*,
		{
			$match: {_id:{$ne: 'easy'}}
		}
		*/
		]);
		//console.log("stats ", stats);
		res.status(200).json({
		status: 'success',
		data: {
			 stats
		}
	});

});