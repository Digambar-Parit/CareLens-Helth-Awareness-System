const User = require('../models/User');

exports.triggerSOS = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // In a real app, this would send SMS/Emails to emergency contacts
    console.log(`SOS triggered by ${user.name}. Notifying:`, user.emergencyContacts);

    res.json({ 
      message: 'SOS signal received. Emergency contacts notified (simulated).',
      contacts: user.emergencyContacts 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
