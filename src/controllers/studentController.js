const tryCatch = require('./../lib/tryCatch');
const Student = require('./../models/studentModel');
const appErrors = require('./../lib/appErrors');
/*const fs = require('fs');
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));*/

const allowedUpdates =(obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if(allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
}

exports.getStudents = tryCatch(async (req,res) => {
	const student = await Student.find();

	res.status(400).json({
		status: 'sucsess',
		data:{
			student
		}
	});
});

exports.updateStudentinfo = tryCatch(async (req,res,next) =>{
	//password shoudln't be update from here
	if(req.body.password || req.body.passwordConfirm){
		return next(new appErrors('Please use the /updatepassword link',400));
	}
	// update the Student Information
	const student = await Student.findById(req.student.id);
	const allowedValues = allowedUpdates(req.body, 'name', 'email');
	const updatedStudent = await Student.findByIdAndUpdate(req.student.id, allowedValues,{
		new: true,
		runValidators: true
	});

	res.status(400).json({
		status: 'success',
		data:{
			student: updatedStudent			
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
	//password shoudln't be update from here

	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
