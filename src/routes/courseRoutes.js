const express = require('express');
const fs = require('fs');
const router = express.Router();
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`)
	);
const getCourses = (req,res) =>{
	res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
};
const addCourse = (req,res) =>{
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
const getOneCourse = (req,res) => {
	console.log(req.params);
	const id = req.params.id * 1;

	const course = courses.find(el => el.id === id);
	if(!course){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(200).json({
		status: 'success',
		data: {
			course
		}
	});
};
const deleteCourse = (req,res) => {
	if( req.params.id * 1 > courses.length){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
};
const updateCourse = (req,res) => {
	if(!course){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
}; 

router.route('/')
	.get(getCourses)
	.post(addCourse);
router.route('/:id')
	.get(getOneCourse)
	.delete(deleteCourse)
	.patch(updateCourse);

module.exports = router;