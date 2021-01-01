const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();
 
router.param('id',(req,res,next,identity)=>{
	console.log(`course id is ${identity}`);
	next();
});
//router.param('id', courseController.checkCourseId);

router.route('/top-duration')
	.get(courseController.topDuration, courseController.getCourses);
router.route('/')
	.get(courseController.getCourses)
	//.post(courseController.checkCourseProperties
	.post(courseController.addCourse);
router.route('/:id')
	.get(courseController.getOneCourse)
	.delete(courseController.deleteCourse)
	.patch(courseController.updateCourse);

module.exports = router;