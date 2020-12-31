const mongoose = require('mongoose');
const fs = require('fs');
const Course = require('./models/courseModel');

// Don't work for some reason
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');


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

const courses = JSON.parse(fs.readFileSync(process.argv[2]));

const addData = async ()=>{
	try{
		await Course.create(courses);
		console.log('Data Added');
		process.exit();

	} catch(err){
		console.log(err);
	}
};
/*
command to run the script
node script.js courses.json --addData
node script.js courses.json --removeData
*/

const removeData = async()=>{
	try {
		await Course.deleteMany();
		console.log('Data Deleted from DB');
		process.exit();
	} catch(err){
		console.log(err);
	}
};
if(process.argv[3] === '--addData'){
	addData();
} else if (process.argv[3] === '--removeData'){
	removeData();
}