const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const auth = require('../middleware/auth');

router.post('/predict', auth, predictionController.getPrediction);
router.get('/history', auth, predictionController.getPredictionHistory);

module.exports = router;
