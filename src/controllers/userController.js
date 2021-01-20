const tryCatch = require('./../lib/tryCatch');
const User = require('./../models/userModel');
const appErrors = require('./../lib/appErrors');
const factoryHandler = require('./../controllers/factoryHandler');
/*const fs = require('fs');
const courses = JSON.parse(fs.readFileSync(`${__dirname}/../fake-data/data/courses.json`));*/

const allowedUpdates =(obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if(allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
}

/* From factory
exports.getUsers = tryCatch(async (req,res) => {
	const user = await User.find();

	res.status(400).json({
		status: 'sucsess',
		data:{
			user
		}
	});
});
*/
exports.deleteMe = tryCatch(async (req,res,next)=>{
	console.log("Inside deleteUser ");
	const user = await User.findByIdAndUpdate(req.user.id, {currentStatus: false});
	res.status(204).json({
		status: 'success',
		data:{
			data: 'User has been deleted'	
		}
	});

});

exports.updateUserinfo = tryCatch(async (req,res,next) =>{
	//password shoudln't be update from here
	if(req.body.password || req.body.passwordConfirm){
		return next(new appErrors('Please use the /updatepassword link',400));
	}
	// update the User Information
	const user = await User.findById(req.user.id);
	const allowedValues = allowedUpdates(req.body, 'name', 'email');
	const updatedUser = await User.findByIdAndUpdate(req.user.id, allowedValues,{
		new: true,
		runValidators: true
	});

	res.status(400).json({
		status: 'success',
		data:{
			user: updatedUser			
		}
	});
});

exports.addUser = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
/* From Factory
exports.getOneuser = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};*/
exports.getOneuser = factoryHandler.getOne(User);
exports.getUsers = factoryHandler.getAll(User);
// These are for the Administrators
exports.deleteUser = factoryHandler.deleteOne(User);
exports.updateUser = factoryHandler.updateOne(User);
