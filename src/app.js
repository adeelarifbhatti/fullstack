const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const appErrors = require('./lib/appErrors');
const ErrorController = require('./controllers/errorController');
const helmet = require('helmet');

const app = express();
console.log("Environment is  ", process.env.NODE_ENV);
// full APP wide  middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
// body parser into req.body
app.use(express.json());
//middleware for public files
app.use(express.static(`${__dirname}/public`));
// middleware fore setting the security headers
app.use(helmet());
//middle for rate limiting
const limiter = rateLimit({
	max: 20,
	windowMs: 60*60*1000,
	message: 'Too many requests, please edit limiter in app.js'
});
app.use('/api',limiter);
//middleware for test
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
