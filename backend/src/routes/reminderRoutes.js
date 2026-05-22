const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
