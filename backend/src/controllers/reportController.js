const ocrService = require('../services/ocrService');
const geminiService = require('../services/geminiService');
const { supabaseAdmin } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

/**
 * POST /api/reports/analyze
 * Uploads a report, runs OCR + AI, saves record to Supabase.
 */
exports.analyzeReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const imagePath = req.file.path;
    const originalName = req.file.originalname;

    // 1. Extract text via OCR
    const extractedText = await ocrService.extractTextFromImage(imagePath);
    if (!extractedText.trim()) {
      fs.unlinkSync(imagePath);
      return res.status(400).json({ error: 'No readable text found in the uploaded file.' });
    }

    // 2. AI analysis
    const analysis = await geminiService.analyzeReportText(extractedText);

    // 3. Upload file to Supabase Storage
    let fileUrl = null;
    try {
      const fileBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(originalName);
      const storagePath = `reports/${req.userId}/${Date.now()}${ext}`;

      const { data: storageData, error: storageError } = await supabaseAdmin
        .storage
        .from('medical-reports')
        .upload(storagePath, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (!storageError && storageData) {
        const { data: urlData } = supabaseAdmin
          .storage
          .from('medical-reports')
          .getPublicUrl(storagePath);
        fileUrl = urlData?.publicUrl || null;
      } else {
        console.error('Storage upload error:', storageError?.message);
      }
    } catch (storageErr) {
      console.error('Storage error (non-fatal):', storageErr.message);
    }

    // 4. Save report record in DB
    const { data: reportRecord, error: dbError } = await supabaseAdmin
      .from('reports')
      .insert([{
        user_id: req.userId,
        file_name: originalName,
        file_url: fileUrl,
        extracted_text: extractedText,
        analysis_summary: analysis.summary,
        markers: analysis.markers,
        abnormalities: analysis.abnormalities,
        suggestions: analysis.suggestions
      }])
      .select()
      .single();

    if (dbError) console.error('Report DB save error:', dbError.message);

    // 5. Clean up local temp file
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    res.json({
      message: 'Report analyzed successfully.',
      report: reportRecord,
      extractedText,
      analysis
    });
  } catch (error) {
    console.error('Analyze report error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reports
 * Returns all reports for the authenticated user.
 */
exports.getReports = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/reports/:id
 * Deletes a report and its file from Supabase Storage.
 */
exports.deleteReport = async (req, res) => {
  try {
    // Fetch the record first to get the file URL
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('file_url')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (fetchError || !report) return res.status(404).json({ error: 'Report not found.' });

    // Delete file from storage if it exists
    if (report.file_url) {
      const storagePath = report.file_url.split('/medical-reports/')[1];
      if (storagePath) {
        await supabaseAdmin.storage.from('medical-reports').remove([storagePath]);
      }
    }

    // Delete DB record
    const { error: deleteError } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (deleteError) throw deleteError;
    res.json({ message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
