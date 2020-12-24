const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();


router.route('/')
	.get(studentController.getStudents)
	.post(studentController.addStudent);
router.route('/:id')
	.get(studentController.getOnestudent)
	.delete(studentController.deleteStudent)
	.patch(studentController.updateStudent);

module.exports = router;