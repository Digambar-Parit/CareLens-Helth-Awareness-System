const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeSymptoms = async (symptoms) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `As a medical assistant, analyze the following symptoms: ${symptoms}. 
  Provide a potential diagnosis (with a disclaimer), recommended actions, severity analysis (Low, Medium, High), and awareness recommendations. 
  Format the response as JSON with keys: diagnosis, recommendations, severity, awarenessTips.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};

exports.analyzeReportText = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Analyze this medical report text: ${text}. 
  Extract key markers, abnormalities, and provide a summary of the health status. 
  Format as JSON with keys: markers, abnormalities, summary, suggestions.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
