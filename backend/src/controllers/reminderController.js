const Reminder = require('../models/Reminder');

exports.createReminder = async (req, res) => {
  try {
    const reminder = new Reminder({ ...req.body, userId: req.userId });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId });
    res.json(reminders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
