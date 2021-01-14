const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');

const router = express.Router();
 
router.param('id',(req,res,next,identity)=>{
	console.log(`course id is ${identity}`);
	next();
});
//router.param('id', courseController.checkCourseId);

router.route('/coursestats')
.get(courseController.getCourseStat);

router.route('/busymonth/:year')
.get(courseController.getBusyMonth);

router.route('/top-duration')
	.get(courseController.topDuration, courseController.getCourses);
router.route('/')
	.get(authController.secure,courseController.getCourses)
	//.post(courseController.checkCourseProperties
	.post(courseController.addCourse);
router.route('/:id')
	.get(courseController.getOneCourse)
	.delete(authController.secure,
		authController.limitedTo('admin', 'teacher'),
		courseController.deleteCourse)
	.patch(courseController.updateCourse);

module.exports = router;