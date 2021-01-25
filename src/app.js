const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const appErrors = require('./lib/appErrors');
const ErrorController = require('./controllers/errorController');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

console.log("Environment is  ", process.env.NODE_ENV);
// full APP wide  middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
// body parser into req.body
app.use(express.json());
// data sanitization against nosql query injections
app.use(mongoSanitize());
// data sanitization against cross site scripts
app.use(xss());
// preventing the parameter polution
app.use(hpp(
	{whitelist: ['duration','fee']}
	)
);
//middleware for public files 
app.use(express.static(`${__dirname}/public`));
// middleware fore setting the security headers
app.use(helmet());
//middle for rate limiting
const limiter = rateLimit({
	max: 100,
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

const reviewRouter = require('./routes/reviewRoutes');
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
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
// Routes

app.get('/',(req,res)=> {
	res.status(200).render('base');
});
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next) => {
	/*res.status(404).json({
		status: 'fail',
		message: `${req.originalUrl} doesn't exists`
	});*/
	next(new appErrors("Route Does not exist", 404));

});

app.use(ErrorController);

module.exports = app;
