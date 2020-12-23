const express = require('express');


const app = express();
app.use(express.json());
const courseRouter = require('./src/routes/courseRoutes');
const studentRouter = require('./src/routes/studentRoutes');
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
const port = 5000; 
app.listen(port, () => {
	console.log ("Server started on port 5000");
});