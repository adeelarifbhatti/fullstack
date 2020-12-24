const fs = require('fs');
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));

exports.getStudents = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
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