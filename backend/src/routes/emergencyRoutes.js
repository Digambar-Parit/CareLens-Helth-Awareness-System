const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

router.post('/sos', auth, emergencyController.triggerSOS);

module.exports = router;
