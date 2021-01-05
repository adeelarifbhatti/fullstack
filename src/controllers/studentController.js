const trycatch = require('./../lib/tryCatch');
const Student = require('./../models/studentModel');
/*const fs = require('fs');
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));*/

exports.getStudents = trycatch(async (req,res) => {
	const student = await Student.find();
	res.status(200).json({
		status: 'sucsess',
		data:{
			student
		}
	});
});
exports.addStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
exports.getOnestudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
exports.deleteStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
exports.updateStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
