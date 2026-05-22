const geminiService = require('../services/geminiService');

exports.getPrediction = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: 'Symptoms are required' });
    
    const analysis = await geminiService.analyzeSymptoms(symptoms);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
