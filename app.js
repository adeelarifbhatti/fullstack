const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
/*app.get('/', (req,res)=> {
res.status(200).send("Hellp from server side");
});


app.get('/json', (req,res)=> {
res.status(200).json({message: "Hello from server side"});
});

app.post('/', (req,res)=> {
res.status(200).send("You can post here");
});*/
const courses = JSON.parse(fs.readFileSync(`${__dirname}/fake-data/data/courses.json`)
	);
const getCourses = (req,res) =>{
	res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
};
const addCourse = (req,res) =>{
	//console.log(res.body);
	const newId = courses[courses.length -1].id + 1;
	const newCourse = Object.assign({id: newId}, req.body);
	courses.push(newCourse);
	fs.writeFile(`${__dirname}/fake-data/data/courses.json`, JSON.stringify(courses),
		err => {
			res.status(201).json({
				status: 'success',
				data: {
					course: newCourse
				}
			});

		});
};
const getOneCourse = (req,res) => {
	console.log(req.params);
	const id = req.params.id * 1;

	const course = courses.find(el => el.id === id);
	if(!course){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(200).json({
		status: 'success',
		data: {
			course
		}
	});
};
const deleteCourse = (req,res) => {
	if( req.params.id * 1 > courses.length){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
};
const updateCourse = (req,res) => {
	if(!course){
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID'
		});
	}
	res.status(204).json({
		status: 'success',
		data: null
	});
}; 
const getStudents = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const addStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const getOnestudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const deleteStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
const updateStudent = (req,res) => {
	res.status(500).json({
		status: 'error',
		message: 'This is not implemented yet'
	});
};
/*app.get('/api/v1/courses',getCourses);
app.post('/api/v1/courses',addCourse);
app.get('/api/v1/courses/:id',getOneCourse);*/
app.route('/api/v1/courses')
	.get(getCourses)
	.post(addCourse);
app.route('/api/v1/courses/:id')
	.get(getOneCourse)
	.delete(deleteCourse)
	.patch(updateCourse);

app.route('/api/v1/students')
	.get(getStudents)
	.post(addStudent);
app.route('/api/v1/student/:id')
	.get(getOnestudent)
	.delete(deleteStudent)
	.patch(updateStudent);
const port = 5000; 
app.listen(port, () => {
	console.log ("Server started on port 5000");
});