const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/lostpassword',authController.lostPassword);
router.patch('/resetpassword/:token',authController.resetPassword);
router.post('/signup', authController.signup);
router.post('/signin', authController.login);
router.patch('/updatepassword', authController.secure, authController.updatePassword);

router.route('/')
	.get(studentController.getStudents)
	.post(studentController.addStudent);
router.route('/:id')
	.get(studentController.getOnestudent)
	.delete(studentController.deleteStudent)
	.patch(studentController.updateStudent);


module.exports = router;
