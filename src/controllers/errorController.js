module.exports = (err, req, res, next)=>{
const catchErrors = require('./../lib/catchErrors');
const castError =(err)=>{
	const message = `invalid ${err.path}: ${err.value}. `;
	return new catchErrors(message,400);
};
const duplicatevalues = (err) =>{
		console.log(err.errmsg, "ADEEL");
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

	console.log(value, "ADEEL");
	const message = ` Duplicate values: ${value}  . Please choose another value. `;
	return new catchErrors(message,400);
};

	const logsForProd = (err,res) => {
		if(err.isOperational){
			res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
		}
		else {
		console.error('Error occured', err);
		res.status(500).json({
			status: 'error',
			message: 'Please contact System Administrator'
		});
		};
	};

	const logsForDev = (err,res) => {
		res.status(err.statusCode).json({
		logs: "These are from my error handling",
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});

	};
	console.log(err.stack);
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

if(process.env.NODE_ENV === 'development'){
	let error = {...err};
	if(error.name === 'CastError') error =	castError(err);
	if(error.code === 11000) error =	duplicatevalues(err);
		logsForDev(error,res);
}
	else if (process.env.NODE_ENV === 'production') {
		let error = {...err};
		if(error.name === 'CastError') error =	castError(error);
		logsForProd(error,res);
}



};
