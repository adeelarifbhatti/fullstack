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
const cookieparser = require('cookie-parser'); 
const cors = require('cors');

const app = express();
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
// Following is for the CORS policy, vue app could not get data before following,
// Error was following
// No 'Access-Control-Allow-Origin' header is present on the requested resource. 
//If an opaque response serves your needs, set the request's mode to 'no-cors' to 
//fetch the resource with CORS disabled.
app.use(cors({
	origin: '*'
  }));

console.log("Environment is  ", process.env.NODE_ENV);
// full APP wide  middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
// body parser into req.body
app.use(express.json());
// following is for using the reading the cookies from the header
app.use(cookieparser());

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
	console.log(req.cookies);
	next();
});

const reviewRouter = require('./routes/reviewRoutes');
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
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


app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/',viewRouter);

app.all('*',(req,res,next) => {
	/*res.status(404).json({
		status: 'fail',
		message: `${req.originalUrl} doesn't exists`
	});*/
	next(new appErrors("Route Does not exist", 404));

});

app.use(ErrorController);

module.exports = app;
