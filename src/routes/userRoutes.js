const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/lostpassword',authController.lostPassword);
router.patch('/resetpassword/:token',authController.resetPassword);
router.post('/signup', authController.signup);
router.post('/signin', authController.login);
router.patch('/updatepassword', authController.secure, authController.updatePassword);
router.patch('/updateuserinfo', authController.secure, userController.updateUserinfo);
router.delete('/deleteuser', authController.secure, userController.deleteMe);


router.route('/')
	.get(userController.getUsers)
	.post(userController.addUser);
router.route('/:id')
	.get(userController.getOneuser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);


module.exports = router;
