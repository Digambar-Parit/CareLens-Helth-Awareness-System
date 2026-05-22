const { supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/emergency/sos
 * Logs an SOS event and returns emergency contact info.
 */
exports.triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;

    // Fetch user and emergency contacts
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('name, email')
      .eq('id', req.userId)
      .single();

    if (userError || !user) return res.status(404).json({ error: 'User not found.' });

    const { data: contacts, error: contactError } = await supabaseAdmin
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', req.userId);

    if (contactError) console.error('Contact fetch error:', contactError.message);

    // Log SOS event in DB
    const { data: sosLog, error: logError } = await supabaseAdmin
      .from('sos_events')
      .insert([{
        user_id: req.userId,
        latitude: latitude || null,
        longitude: longitude || null,
        message: message || 'SOS triggered.',
        contacts_notified: contacts?.length || 0,
        status: 'active'
      }])
      .select()
      .single();

    if (logError) console.error('SOS log error:', logError.message);

    console.log(`🚨 SOS triggered by ${user.name}. Contacts:`, contacts);

    res.json({
      message: 'SOS signal received. Emergency contacts notified (simulated).',
      user: { name: user.name },
      contacts: contacts || [],
      event_id: sosLog?.id
    });
  } catch (error) {
    console.error('SOS error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/emergency/contacts
 * Returns all emergency contacts for the authenticated user.
 */
exports.getContacts = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/emergency/contacts
 * Adds a new emergency contact for the authenticated user.
 */
exports.addContact = async (req, res) => {
  try {
    const { contact_name, phone_number, relation } = req.body;
    if (!contact_name || !phone_number) {
      return res.status(400).json({ error: 'contact_name and phone_number are required.' });
    }

    const { data, error } = await supabaseAdmin
      .from('emergency_contacts')
      .insert([{
        user_id: req.userId,
        contact_name,
        phone_number,
        relation: relation || null
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/emergency/contacts/:id
 * Removes an emergency contact.
 */
exports.deleteContact = async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('emergency_contacts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ message: 'Contact removed successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/emergency/sos-history
 * Returns past SOS events for the user.
 */
exports.getSOSHistory = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('sos_events')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
