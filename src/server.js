const mongoose = require('mongoose');

// Don't work for some reason
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');
process.on('uncaughtException', err=>{
	console.log(err.name,err.message);
	console.log('Uncaught Exception');
			process.exit(1);
});

/*const DB = process.env.DATABASE.replace('<PASSWORD>',
	process.env.DATABASE_PASSWORD);
	*/

//mongoose.connect('mongodb://my-mongo:27017/StudySystem', {
mongoose.connect( process.env.DATABASE_LOCAL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false

}).then(dbconnection =>{
//	console.log(dbconnection.connections);
	console.log('Database is connected');
});
console.log("VARIABLE IN config.env VARIABLE ", process.env.VARIABLE);
// Doesn't work
//const port = process.env.PORT ;
const port = process.env.PORT;
const server = app.listen(port, () => {
console.log (`Server started on port " + ${port}`);
});

process.on('unhandledRejection', err=>{
	console.log(err.name,err.message);
	console.log('UNHANDLED REJECTION');
	server.close(() =>{
		process.exit(1);
	});
});
