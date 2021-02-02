const Course = require('../models/courseModel');
const tryCatch = require('../lib/tryCatch');
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
   
exports.getLogin = tryCatch(async(req,res,next)=> {

	res.status(200).render('login', {
        title: 'Login From Adeel',
    });
   });



