const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const isGeminiEnabled = apiKey && apiKey.trim() !== "" && !apiKey.startsWith("your_");

let genAI = null;
if (isGeminiEnabled) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ Gemini AI Service initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize GoogleGenerativeAI:", err.message);
  }
} else {
  console.warn("⚠️ Gemini API key missing or placeholder. Running Gemini Service in Simulation Mode.");
}

function cleanJSONString(str) {
  let clean = str;
  // Strip markdown formatting if Gemini wrapped the JSON in backticks
  if (clean.includes("```")) {
    const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      clean = match[1];
    }
  }
  return clean.trim();
}

exports.analyzeSymptoms = async (symptoms, age, habits, conditions) => {
  if (isGeminiEnabled && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `As a medical assistant, analyze the following symptoms: ${symptoms}. 
      Additional context: Age is ${age || 'Not provided'}, habits are ${habits || 'Not provided'}, existing conditions are ${conditions || 'Not provided'}.
      Provide a potential diagnosis (with a disclaimer), recommended actions, severity analysis (Low, Medium, High), and awareness recommendations. 
      Format the response as a valid JSON object with keys: diagnosis, recommendations, severity, awarenessTips.
      Do not add any explanations outside the JSON object.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanText = cleanJSONString(response.text());
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Gemini AI API Call failed, falling back to simulation:", error.message);
    }
  }

  // Fallback / Simulation Mode Heuristic Engine
  console.log("🤖 Running symptom analysis in simulation mode...");
  const symptomsStr = String(symptoms).toLowerCase();
  
  let diagnosis = "Mild seasonal allergy or baseline stress indicator.";
  let severity = "Low";
  let recommendations = [
    "Ensure adequate hydration (+500ml water intake suggested).",
    "Engage in box breathing exercises (5-5-5-5 seconds) to reduce tension.",
    "Monitor symptoms and record variations in the morning."
  ];
  let awarenessTips = "Avoid exposure to triggers and maintain a restful sleep schedule.";

  if (symptomsStr.includes("chest") || symptomsStr.includes("pain") || symptomsStr.includes("heart")) {
    diagnosis = "Cardiovascular tension or potential acute respiratory stress.";
    severity = "High";
    recommendations = [
      "Contact your primary care physician or dial local emergency services immediately.",
      "Access the CareLens SOS module to notify emergency contacts.",
      "Sit in an upright, relaxed posture and avoid sudden movements."
    ];
    awarenessTips = "Chest pain paired with shortness of breath is a critical indicator. Seek medical support immediately.";
  } else if (symptomsStr.includes("fever") || symptomsStr.includes("cough") || symptomsStr.includes("breath")) {
    diagnosis = "Acute respiratory load or viral infection indicators.";
    severity = "Medium";
    recommendations = [
      "Track your temperature hourly and record variations.",
      "Rest in a clean, well-ventilated room and limit physical exertion.",
      "Consider virtual consultation with a physician if fever exceeds 101F."
    ];
    awarenessTips = "Ensure you isolate from others if a contagious viral profile is suspected.";
  } else if (symptomsStr.includes("fatigue") || symptomsStr.includes("headache") || symptomsStr.includes("tired")) {
    diagnosis = "Dehydration, sleep debt, or moderate physical fatigue.";
    severity = "Medium";
    recommendations = [
      "Increase daily water intake to 2.5-3 liters.",
      "Maintain a consistent sleep window and aim for 8 hours tonight.",
      "Limit screen exposure and engage in light stretching."
    ];
    awarenessTips = "Fatigue can be a symptom of nutritional deficit or prolonged mental stress.";
  }

  return {
    diagnosis,
    recommendations,
    severity,
    awarenessTips
  };
};

exports.analyzeReportText = async (text) => {
  if (isGeminiEnabled && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze this medical report text: ${text}. 
      Extract key markers, abnormalities, and provide a summary of the health status. 
      Format as a valid JSON object with keys: markers, abnormalities, summary, suggestions.
      Do not add any explanations outside the JSON object.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanText = cleanJSONString(response.text());
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Gemini AI API Call failed for report, falling back to simulation:", error.message);
    }
  }

  // Fallback OCR interpreter simulation
  console.log("🤖 Running report text analysis in simulation mode...");
  
  return {
    markers: "Blood Pressure: 118/76 mmHg, Resting Heart Rate: 72 bpm, Cholesterol: Normal",
    abnormalities: "None detected in parsed text segments.",
    summary: "The scanned report indicates optimal cardiovascular performance and healthy baseline levels.",
    suggestions: "Continue maintaining current balanced diet and active minutes checklist."
  };
};
