const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

router.post('/sos', auth, emergencyController.triggerSOS);
router.get('/sos-history', auth, emergencyController.getSOSHistory);
router.get('/contacts', auth, emergencyController.getContacts);
router.post('/contacts', auth, emergencyController.addContact);
router.delete('/contacts/:id', auth, emergencyController.deleteContact);

module.exports = router;
