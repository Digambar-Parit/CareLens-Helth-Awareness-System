const ocrService = require('../services/ocrService');
const geminiService = require('../services/geminiService');
const fs = require('fs');

exports.analyzeReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imagePath = req.file.path;
    const extractedText = await ocrService.extractTextFromImage(imagePath);
    
    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No text found in the image' });
    }

    const analysis = await geminiService.analyzeReportText(extractedText);
    
    // Optional: Delete the file after processing
    fs.unlinkSync(imagePath);

    res.json({
      extractedText,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
