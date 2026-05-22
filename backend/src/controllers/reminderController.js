const { supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/reminders
 * Creates a new medicine reminder for the authenticated user.
 */
exports.createReminder = async (req, res) => {
  try {
    const { medicine_name, dosage, reminder_time, frequency, notes } = req.body;

    if (!medicine_name || !reminder_time) {
      return res.status(400).json({ error: 'medicine_name and reminder_time are required.' });
    }

    const { data, error } = await supabaseAdmin
      .from('reminders')
      .insert([{
        user_id: req.userId,
        medicine_name,
        dosage: dosage || null,
        reminder_time,
        frequency: frequency || 'daily',
        notes: notes || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create reminder error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/reminders
 * Returns all active reminders for the authenticated user.
 */
exports.getReminders = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reminders')
      .select('*')
      .eq('user_id', req.userId)
      .order('reminder_time', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * PATCH /api/reminders/:id
 * Updates a reminder (toggle active, change time, etc.)
 */
exports.updateReminder = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reminders')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/reminders/:id
 * Deletes a reminder for the authenticated user.
 */
exports.deleteReminder = async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('reminders')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ message: 'Reminder deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
