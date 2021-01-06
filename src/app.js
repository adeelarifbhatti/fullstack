const express = require('express');
const morgan = require('morgan');
const appErrors = require('./lib/appErrors');
const ErrorController = require('./controllers/errorController');

const app = express();
console.log("Environment is  ", process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req,res,next) => {
	req.requestTime = new Date().toISOString();
	console.log(req.headers);
	next();
});
const courseRouter = require('./routes/courseRoutes');
const studentRouter = require('./routes/studentRoutes');
/*app.get('/', (req,res)=> {
res.status(200).send("Hellp from server side");
});


app.get('/json', (req,res)=> {
res.status(200).json({message: "Hello from server side"});
});

app.post('/', (req,res)=> {
res.status(200).send("You can post here");
});*/




/*app.get('/api/v1/courses',getCourses);
app.post('/api/v1/courses',addCourse);
app.get('/api/v1/courses/:id',getOneCourse);*/

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/students', studentRouter);

app.all('*',(req,res,next) => {
	/*res.status(404).json({
		status: 'fail',
		message: `${req.originalUrl} doesn't exists`
	});*/
	next(new appErrors("Route Does not exist", 404));

});

app.use(ErrorController);

module.exports = app;
