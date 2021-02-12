module.exports = (err, req, res, next)=>{
const appErrors = require('./../lib/appErrors');

const castError =(err)=>{
	const message = `invalid ${err.path}: ${err.value}. `;
	return new appErrors(message,400);
};

const myJsonWebTokenError =()=>{return new appErrors('Invalid Token',400);}
const myTokenExpiredError =()=>{return new appErrors('Expired Token',400);}


const duplicatevalues = (err) =>{
		console.log(err.errmsg, "ADEEL");
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

	console.log(value, "ADEEL");
	const message = ` Duplicate values: ${value}  . Please choose another value. `;
	return new appErrors(message,400);
};

	const logsForProd = (err,req,res) => {
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

	const logsForDev = (err,req,res) => {
		// for API
		if(req.originalUrl.startsWith('/api')){
			console.log("ERROR is#########\n ",err, "\n ################END of ERROR")
			res.status(err.status).json({
			logs: "These are from my error handling",
			status: err.statusCode,
			error: err,
			message: err.message,
			stack: err.stack
			});			
			console.log("err.stack ",err.stack);
			console.log(err.statusCode = err.statusCode || 500);
			console.log(err.status = err.status || 'error');
		}
		// For web pages
		else {
			res.status(err.statusCode).render('error', {
				title: 'Something went wrong',
				msg: err.message
			});
		}
	}

if(process.env.NODE_ENV === 'development'){
	let error = {...err};
	error.message = err.message;
	if(error.name === 'CastError') error =	castError(err);
	if(error.code === 11000) error =	duplicatevalues(err);
	if(error.name === 'JsonWebTokenError') error = myJsonWebTokenError();
	if(error.name === 'TokenExpiredError') error = myTokenExpiredError();
	
		logsForDev(error,req,res);
}
	else if (process.env.NODE_ENV === 'production') {
		let error = {...err};
		error.message = err.message;
		if(error.name === 'CastError') error =	castError(error);
		logsForProd(error,res);
}



};
