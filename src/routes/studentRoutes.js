const express = require('express');
const fs = require('fs');
const router = express.Router();
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`)
	);
const getStudents = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const addStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const getOnestudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const deleteStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const updateStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};

router.route('/')
	.get(getStudents)
	.post(addStudent);
router.route('/:id')
	.get(getOnestudent)
	.delete(deleteStudent)
	.patch(updateStudent);

module.exports = router;