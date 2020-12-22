const express = require('express');
const fs = require('fs');

const app = express();
/*app.get('/', (req,res)=> {
res.status(200).send("Hellp from server side");
});


app.get('/json', (req,res)=> {
res.status(200).json({message: "Hello from server side"});
});

app.post('/', (req,res)=> {
res.status(200).send("You can post here");
});*/

const courses = JSON.parse(fs.readFileSync(`${__dirname}/fake-data/data/tours.json`)
	);
app.get('/api/v1/courses',(req,res) =>{
	res.status(200).json({
		status: 'success',
		results: courses.length,
		data: {
			courses
		}
	});
});
const port = 5000; 
app.listen(port, () => {
	console.log ("Server started on port 5000");
});