const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.loggedInCheck);
router.get('/', viewController.getLogin);
router.get('/login', viewController.getLogin);
router.get('/course/:slug',viewController.getfullCourse);

router.get('/overview', viewController.getOverview);

module.exports = router;