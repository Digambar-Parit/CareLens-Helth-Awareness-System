const supabase = require('../config/supabase');

exports.createReminder = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ ...req.body, user_id: req.userId }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
