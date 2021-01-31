const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getLogin);
router.get('/login', viewController.getLogin);

router.get('/overview', viewController.getOverview);

module.exports = router;