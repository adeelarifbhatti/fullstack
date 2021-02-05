const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewController.getLogin);
router.get('/login', viewController.getLogin);

router.get('/overview',authController.secure, viewController.getOverview);

module.exports = router;