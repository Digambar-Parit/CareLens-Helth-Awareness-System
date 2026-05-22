const supabase = require('../config/supabase');

exports.triggerSOS = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('name, emergency_contacts')
      .eq('id', req.userId)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    console.log(`SOS triggered by ${user.name}. Notifying:`, user.emergency_contacts);

    res.json({ 
      message: 'SOS signal received. Emergency contacts notified (simulated).',
      contacts: user.emergency_contacts 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
