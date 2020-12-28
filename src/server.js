const mongoose = require('mongoose');

// Don't work for some reason
//const dotenv = require('dotenv');
//dotenv.config({ path: './config.env' });

const app = require('./app');

/*const DB = process.env.DATABASE.replace('<PASSWORD>',
	process.env.DATABASE_PASSWORD);
	*/
// config.env	mongoose.connect('process.env.DATABASE_LOCAL'
mongoose.connect('mongodb://my-mongo:27017/StudySystem', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false

}).then(dbconnection =>{
	console.log(dbconnection.connections);
	console.log('Database is connected');
});
console.log(process.env);
// Doesn't work
//const port = process.env.PORT ; 
const port = 5000;
app.listen(port, () => {
console.log (`Server started on port " + ${port}`);
});