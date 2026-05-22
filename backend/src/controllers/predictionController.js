const geminiService = require('../services/geminiService');
const { supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/prediction/predict
 * Runs AI symptom analysis and saves result to Supabase.
 */
exports.getPrediction = async (req, res) => {
  try {
    const { symptoms, age, habits, conditions } = req.body;
    if (!symptoms) return res.status(400).json({ error: 'Symptoms are required.' });

    const analysis = await geminiService.analyzeSymptoms(symptoms, age, habits, conditions);

    // Persist prediction to symptoms table
    const { error: dbError } = await supabaseAdmin
      .from('symptoms')
      .insert([{
        user_id: req.userId,
        symptoms,
        prediction: analysis.diagnosis,
        severity: analysis.severity,
        recommendations: analysis.recommendations,
        awareness_tips: analysis.awarenessTips
      }]);

    if (dbError) console.error('Symptom save error:', dbError.message);

    res.json(analysis);
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/prediction/history
 * Returns all past symptom predictions for the logged-in user.
 */
exports.getPredictionHistory = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('symptoms')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
