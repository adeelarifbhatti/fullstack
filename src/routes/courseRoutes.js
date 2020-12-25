const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();
 
router.param('id',(req,res,next,identity)=>{
	console.log(`course id is ${identity}`);
	next();
});
router.param('id', courseController.checkCourseId);

router.route('/')
	.get(courseController.getCourses)
	.post(courseController.checkCourseProperties, courseController.addCourse);
router.route('/:id')
	.get(courseController.getOneCourse)
	.delete(courseController.deleteCourse)
	.patch(courseController.updateCourse);

module.exports = router;