const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();
 

router.route('/')
	.get(courseController.getCourses)
	.post(courseController.addCourse);
router.route('/:id')
	.get(courseController.getOneCourse)
	.delete(courseController.deleteCourse)
	.patch(courseController.updateCourse);

module.exports = router;