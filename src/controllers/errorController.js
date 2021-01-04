module.exports = (err, req, res, next)=>{

	console.log(err.stack);
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if(process.env.NODE_ENV === 'development'){
		res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});

	}
	else if (process.env.NODE_ENV === 'production') {
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
	}
	



};