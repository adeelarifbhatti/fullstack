const express = require('express');
const morgan = require('morgan');

const app = express();
console.log("Environment is  ", process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
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

module.exports = app;
