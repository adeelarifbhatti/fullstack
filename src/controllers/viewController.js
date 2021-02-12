const Course = require('../models/courseModel');
const tryCatch = require('../lib/tryCatch');
const appErrors = require('./../lib/appErrors');

exports.getLogin = (req,res)=> {
	res.status(200).render('login', {
        title: 'Adeel Please Login'
    });
}

exports.getOverview = tryCatch(async(req,res,next)=> {
    // get courses from collection
    const courses = await Course.find();
    console.log("From viewController getOverview ",courses);
    // Build Template
	res.status(200).render('overview', {
        title: 'Overview',
        courses
    });
   });
   exports.getfullCourse = tryCatch(async(req,res,next)=> {
    // get courses from collection
    const course = await Course.findOne({slug: req.params.slug});
    console.log("From viewController getOverview ",course);
    // Build Template
    if(!course){
        return next(new appErrors('There is no course', 404));
    }
	res.status(200).render('fullCourse', {
        title: 'Course Details',
        course
    });
   });
   
exports.getLogin = tryCatch(async(req,res,next)=> {

	res.status(200).render('login', {
        title: 'Login From Adeel',
    });
   });




