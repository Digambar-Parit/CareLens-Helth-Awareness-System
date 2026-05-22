/* ====================================================
   CareLens AI - Disease Detection Toolkit Logic
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const chips = document.querySelectorAll('.chips .chip-btn');
  const uploadZone = document.getElementById('uploadZone');
  const uploadPreview = document.getElementById('uploadPreview');
  const customSymptoms = document.getElementById('customSymptoms');
  const severityFill = document.getElementById('severityFill');
  const severityLabel = document.getElementById('severityLabel');
  const severityPercent = document.getElementById('severityPercent');
  const severitySummary = document.getElementById('severitySummary');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const chatLog = document.querySelector('.chat-log');
  const cameraFrame = document.querySelector('.camera-frame');

  // Helper to add lines to the console terminal
  function addConsoleLine(text, type = '') {
    const consoleTerminal = document.getElementById('detectionConsoleTerminal');
    if (!consoleTerminal) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${timeStr}] ${text}`;
    consoleTerminal.appendChild(line);
    consoleTerminal.scrollTop = consoleTerminal.scrollHeight;
  }

  // Base symptom risk weighting
  const riskWeights = {
    'fatigue': 10,
    'fever': 25,
    'cough': 15,
    'headache': 12,
    'chest pain': 45,
    'shortness': 35
  };

  // 1. Symptom Chips Interaction
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      calculateRisk();
    });
  });

  // Calculate current risk score
  function calculateRisk() {
    let score = 0;
    let activeSymptomCount = 0;

    // Check chips
    chips.forEach(chip => {
      if (chip.classList.contains('active')) {
        const text = chip.textContent.toLowerCase().trim();
        score += riskWeights[text] || 10;
        activeSymptomCount++;
      }
    });

    // Check custom text input
    if (customSymptoms && customSymptoms.value) {
      const textVal = customSymptoms.value.toLowerCase();
      if (textVal.includes('pain') || textVal.includes('chest')) score += 20;
      if (textVal.includes('fever') || textVal.includes('hot')) score += 15;
      if (textVal.includes('cough') || textVal.includes('breath')) score += 15;
      if (textVal.includes('head') || textVal.includes('migraine')) score += 10;
      if (textVal.includes('tired') || textVal.includes('fatigue')) score += 10;
      activeSymptomCount++;
    }

    if (activeSymptomCount === 0) {
      score = 20; // default baseline
    }

    score = Math.min(score, 99); // limit at 99%
    return score;
  }

  function updateSeverityUI(score) {
    if (!severityFill) return;

    severityFill.style.width = `${score}%`;
    if (severityPercent) severityPercent.textContent = `${score}%`;

    let level = 'Low risk';
    let summary = 'Low risk detected';
    let colorClass = 'var(--success)';

    if (score >= 60) {
      level = 'High risk';
      summary = 'Urgent Clinical Review Advised';
      colorClass = 'var(--danger)';
      severityFill.style.background = 'linear-gradient(90deg, var(--danger), var(--warning))';
    } else if (score >= 30) {
      level = 'Moderate risk';
      summary = 'Moderate Probability of Mild Stress';
      colorClass = 'var(--warning)';
      severityFill.style.background = 'linear-gradient(90deg, var(--warning), var(--primary))';
    } else {
      level = 'Low risk';
      summary = 'Normal baseline detected';
      colorClass = 'var(--success)';
      severityFill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
    }

    if (severityLabel) {
      severityLabel.textContent = level;
      severityLabel.style.color = colorClass;
    }
    if (severitySummary) {
      severitySummary.textContent = summary;
      severitySummary.style.color = colorClass;
    }
  }

  // Live typing check
  if (customSymptoms) {
    customSymptoms.addEventListener('input', () => {
      const score = calculateRisk();
      updateSeverityUI(score);
    });
  }

  // Send symptoms button listener
  const sendSymptomBtn = document.getElementById('sendSymptomBtn');
  if (sendSymptomBtn) {
    sendSymptomBtn.addEventListener('click', () => {
      if (analyzeBtn) {
        analyzeBtn.click();
      }
    });
  }

  // 2. Analyze Button Action
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const score = calculateRisk();
      updateSeverityUI(score);

      // Perform analysis text modification
      const analysisContent = document.querySelector('.analysis-content');
      if (analysisContent) {
        let titleText = "";
        let details = [];

        if (score >= 60) {
          titleText = "CareLens has identified a high clinical indicator matching respiratory or cardio-stress profile.";
          details = [
            "Contact your healthcare provider or dial emergency support if symptoms worsen.",
            "Avoid strenuous activity and rest in an upright posture.",
            "Monitor oxygen levels and blood pressure immediately."
          ];
        } else if (score >= 30) {
          titleText = "CareLens indicates moderate fatigue or respiratory load. Rest and wellness tracking recommended.";
          details = [
            "Maintain active hydration: we suggest +500ml water intake.",
            "Engage in deep breathing exercises (5-5-5-5 seconds box breathing).",
            "Ensure 8 hours of restful sleep tonight and log symptoms in the morning."
          ];
        } else {
          titleText = "CareLens analysis indicates a healthy status with low risk indicators.";
          details = [
            "Continue standard healthy dietary habits.",
            "Stay active with moderate physical movement (30 minutes walk).",
            "Report any changes in daily wellness directly to CareLens."
          ];
        }

        analysisContent.innerHTML = `
          <p class="lead" style="font-weight:600; color:var(--text-main); margin-bottom:12px;">${titleText}</p>
          <ul>
            ${details.map(d => `<li>${d}</li>`).join('')}
          </ul>
        `;
      }

      // Add messages to transcript chat-log
      if (chatLog) {
        // Remove typing indicator if it is there
        const typingIndicator = chatLog.querySelector('.typing');
        if (typingIndicator) typingIndicator.remove();

        // Get user symptoms text summary
        let selected = [];
        chips.forEach(chip => {
          if (chip.classList.contains('active')) selected.push(chip.textContent);
        });
        if (customSymptoms && customSymptoms.value.trim()) {
          selected.push(customSymptoms.value.trim());
        }

        const userMsgText = selected.length > 0 
          ? `I'm tracking: ${selected.join(', ')}.` 
          : "Analyzing general baseline wellness.";

        // Append user bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'bubble user';
        userBubble.textContent = userMsgText;
        chatLog.appendChild(userBubble);

        // Sync to modal chat if open
        const modalChatLog = document.getElementById('modalChatLog');
        if (modalChatLog) {
          const uBubbleModal = userBubble.cloneNode(true);
          modalChatLog.appendChild(uBubbleModal);
          modalChatLog.scrollTop = modalChatLog.scrollHeight;
        }

        // Log POST request to terminal
        addConsoleLine(`POST http://localhost:3000/api/detect-disease HTTP/1.1`, 'req');
        addConsoleLine(`Content-Type: application/json\nUser-Agent: CareLensClient/1.0`, 'time');
        const payload = {
          patientId: "amara-reid-492",
          symptoms: selected,
          customInput: customSymptoms ? customSymptoms.value : "",
          timestamp: new Date().toISOString()
        };
        addConsoleLine(`PAYLOAD: ${JSON.stringify(payload, null, 2)}`, 'time');

        // Append typing indicator
        const assistantTyping = document.createElement('div');
        assistantTyping.className = 'bubble assistant typing';
        assistantTyping.innerHTML = '<span></span><span></span><span></span>';
        chatLog.appendChild(assistantTyping);

        if (modalChatLog) {
          const aTypingModal = assistantTyping.cloneNode(true);
          modalChatLog.appendChild(aTypingModal);
          modalChatLog.scrollTop = modalChatLog.scrollHeight;
        }

        // Scroll
        chatLog.scrollTop = chatLog.scrollHeight;

        setTimeout(() => {
          // Remove typing indicators
          const typingDots = document.querySelectorAll('.chat-log .typing');
          typingDots.forEach(dot => dot.remove());

          const assistantBubble = document.createElement('div');
          assistantBubble.className = 'bubble assistant';
          
          if (score >= 60) {
            assistantBubble.textContent = "Amara, I've logged these symptoms in your history. Based on the high score (urgent clinical indicator), I highly recommend scheduling a consultation or accessing SOS services on the Emergency page.";
          } else if (score >= 30) {
            assistantBubble.textContent = "Amara, I've noted a moderate fatigue indicator. I have updated your dashboard guidelines. Hydration tracking is advised.";
          } else {
            assistantBubble.textContent = "Amara, everything looks stable. I'll check back in at your next reminder window.";
          }
          chatLog.appendChild(assistantBubble);
          
          if (modalChatLog) {
            const aBubbleModal = assistantBubble.cloneNode(true);
            modalChatLog.appendChild(aBubbleModal);
            modalChatLog.scrollTop = modalChatLog.scrollHeight;
          }
          chatLog.scrollTop = chatLog.scrollHeight;

          // Log RESPONSE to terminal
          addConsoleLine(`HTTP/1.1 200 OK\nContent-Type: application/json`, 'resp');
          const responsePayload = {
            success: true,
            riskScore: score,
            riskLevel: score >= 60 ? "High" : (score >= 30 ? "Moderate" : "Low"),
            aiDiagnostics: assistantBubble.textContent,
            recommendations: details
          };
          addConsoleLine(`RESPONSE: ${JSON.stringify(responsePayload, null, 2)}`, 'resp');
        }, 1200);
      }
    });
  }

  // 3. Reset Button Action
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chips.forEach(chip => chip.classList.remove('active'));
      if (customSymptoms) customSymptoms.value = '';
      updateSeverityUI(20);
      
      const analysisContent = document.querySelector('.analysis-content');
      if (analysisContent) {
        analysisContent.innerHTML = `
          <p class="lead">CareLens has reset. Select chips or input symptoms to begin analysis.</p>
          <ul>
            <li>Select symptom factors above</li>
            <li>Tap Analyze now to trigger scans</li>
          </ul>
        `;
      }

      if (chatLog) {
        chatLog.innerHTML = `
          <div class="bubble assistant">Hi Amara, I'm reviewing your symptom inputs now.</div>
        `;
      }
    });
  }

  // 4. Camera Simulation
  if (cameraFrame) {
    let isScanning = false;
    cameraFrame.style.cursor = 'pointer';
    
    // Add scan line HTML
    const scanLine = document.createElement('div');
    scanLine.className = 'camera-scan-line';
    cameraFrame.appendChild(scanLine);

    cameraFrame.addEventListener('click', () => {
      if (isScanning) return;
      isScanning = true;
      
      cameraFrame.style.background = '#1e293b';
      cameraFrame.innerHTML = `
        <div class="camera-scan-line" style="display:block;"></div>
        <span data-lucide="loader" class="animate-spin" style="color:var(--accent);"></span>
        <p style="margin-top:10px; font-weight:600;">Calibrating camera...</p>
      `;
      if (window.lucide) window.lucide.replace();

      setTimeout(() => {
        cameraFrame.innerHTML = `
          <div class="camera-scan-line" style="display:block;"></div>
          <span data-lucide="scan-face" style="color:var(--accent); animation: pulse 1s infinite alternate;"></span>
          <p style="margin-top:10px; font-weight:600; color:var(--accent);">Scanning face features...</p>
        `;
        if (window.lucide) window.lucide.replace();
      }, 1500);

      setTimeout(() => {
        cameraFrame.innerHTML = `
          <span data-lucide="check-circle" style="color:var(--success);"></span>
          <p style="margin-top:10px; font-weight:600;">Scan Complete</p>
          <p style="font-size:0.8rem; opacity:0.8; color:var(--success);">Mild fatigue detected (12%)</p>
        `;
        if (window.lucide) window.lucide.replace();
        
        // Add to symptoms automatically
        const fatigueChip = Array.from(chips).find(c => c.textContent.toLowerCase().trim() === 'fatigue');
        if (fatigueChip && !fatigueChip.classList.contains('active')) {
          fatigueChip.classList.add('active');
          updateSeverityUI(calculateRisk());
        }
        
        isScanning = false;
      }, 4000);
    });
  }

  // 5. Drag & Drop File Upload Simulation
  if (uploadZone) {
    uploadZone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.png,.jpg,.jpeg,.pdf';
      input.onchange = () => {
        if (input.files.length) {
          handleFile(input.files[0]);
        }
      };
      input.click();
    });

    uploadZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      uploadZone.style.borderColor = 'var(--primary)';
      uploadZone.style.background = 'rgba(79, 172, 254, 0.08)';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'rgba(79, 172, 254, 0.25)';
      uploadZone.style.background = 'rgba(255, 255, 255, 0.4)';
    });

    uploadZone.addEventListener('drop', (event) => {
      event.preventDefault();
      uploadZone.style.borderColor = 'rgba(79, 172, 254, 0.25)';
      uploadZone.style.background = 'rgba(255, 255, 255, 0.4)';
      if (event.dataTransfer.files.length) {
        handleFile(event.dataTransfer.files[0]);
      }
    });

    function handleFile(file) {
      if (uploadPreview) {
        uploadPreview.innerHTML = `
          <div class="flex-between">
            <span style="font-weight:600; color:var(--text-main);">${file.name}</span>
            <span class="chip" style="background:rgba(34, 197, 94, 0.1); border-color:var(--success); color:var(--success);">Uploaded</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-soft); margin-top:6px;">OCR extraction complete. Identified: blood biochemistry reports. Healthy threshold.</p>
        `;
      }
      
      // Log upload to console
      addConsoleLine(`POST http://localhost:3000/api/analyze-report HTTP/1.1`, 'req');
      addConsoleLine(`Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXyZ123`, 'time');
      addConsoleLine(`FILE DATA: name="${file.name}", size=${file.size} bytes`, 'time');
      setTimeout(() => {
        addConsoleLine(`HTTP/1.1 200 OK\nContent-Type: application/json`, 'resp');
        addConsoleLine(`RESPONSE: {"success":true,"message":"File uploaded and parsed successfully","extractedText":"Identified: blood biochemistry reports. Healthy threshold."}`, 'resp');
      }, 1000);
    }
  }

  // 6. Modal Expand and Close Handlers
  const expandBtn = document.getElementById('expandDetectionChatBtn');
  const closeBtn = document.getElementById('closeDetectionChatBtn');
  const modal = document.getElementById('detectionChatModal');
  const modalChatLog = document.getElementById('modalChatLog');
  const modalChatInput = document.getElementById('modalChatInput');
  const modalSendBtn = document.getElementById('modalSendBtn');

  if (expandBtn && closeBtn && modal) {
    expandBtn.addEventListener('click', () => {
      // Sync messages from main chat to modal chat
      if (modalChatLog && chatLog) {
        modalChatLog.innerHTML = chatLog.innerHTML;
        modalChatLog.scrollTop = modalChatLog.scrollHeight;
      }
      modal.classList.add('active');
      addConsoleLine("Opened expanded clinical diagnostic interface.", "time");
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Close modal on clicking outside the window
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Helper to send message in modal chat
  function sendModalMessage() {
    if (!modalChatInput || !modalChatInput.value.trim()) return;
    const text = modalChatInput.value.trim();
    modalChatInput.value = '';

    // Append to modal chat log
    appendMessage(text, 'user');
    
    // Log POST request to terminal
    addConsoleLine(`POST http://localhost:3000/api/chat HTTP/1.1`, 'req');
    addConsoleLine(`Content-Type: application/json\nUser-Agent: CareLensClient/1.0`, 'time');
    const payload = {
      message: text,
      timestamp: new Date().toISOString()
    };
    addConsoleLine(`PAYLOAD: ${JSON.stringify(payload, null, 2)}`, 'time');

    // Show typing indicator
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      
      // Generate response based on user input or active symptoms
      let response = "I've noted your input. Based on your symptoms profile, please monitor for any escalation in fever or chest tightness. Let me know if you would like me to explain any particular metrics.";
      
      const lower = text.toLowerCase();
      if (lower.includes('chest') || lower.includes('pain') || lower.includes('tight')) {
        response = "Chest tightness/pain is a high priority indicator. If it is accompanied by pressure, spreading pain, or shortness of breath, please access our Emergency/SOS dashboard or call medical services immediately.";
      } else if (lower.includes('fever') || lower.includes('temperature')) {
        response = "For fever symptoms, monitor your temperature hourly. Keep hydrated (aim for 2-3 liters of water/electrolytes daily) and consider resting in a well-ventilated room.";
      } else if (lower.includes('help') || lower.includes('what can i do')) {
        response = "You can ask me questions about your active symptoms, how to manage them, or request a summary of the clinical recommendations provided in the AI Analysis panel.";
      } else if (lower.includes('thank') || lower.includes('okay')) {
        response = "You're welcome! CareLens is here to assist. Let me know if there's anything else you'd like to check.";
      }

      appendMessage(response, 'assistant');

      // Log response to terminal
      addConsoleLine(`HTTP/1.1 200 OK\nContent-Type: application/json`, 'resp');
      const responsePayload = {
        success: true,
        reply: response,
        model: "CareLens-MedLLM-v2"
      };
      addConsoleLine(`RESPONSE: ${JSON.stringify(responsePayload, null, 2)}`, 'resp');
    }, 1200);
  }

  function appendMessage(text, sender) {
    // Append to modal chat log
    if (modalChatLog) {
      const bubble = document.createElement('div');
      bubble.className = `bubble ${sender}`;
      bubble.textContent = text;
      modalChatLog.appendChild(bubble);
      modalChatLog.scrollTop = modalChatLog.scrollHeight;
    }

    // Append to main page chat log to keep them in sync
    if (chatLog) {
      const bubble = document.createElement('div');
      bubble.className = `bubble ${sender}`;
      bubble.textContent = text;
      chatLog.appendChild(bubble);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    if (window.applyTranslations) {
      window.applyTranslations();
    }
  }

  function showTypingIndicator() {
    const indicatorHtml = '<span></span><span></span><span></span>';
    
    if (modalChatLog) {
      const div = document.createElement('div');
      div.className = 'bubble assistant typing';
      div.innerHTML = indicatorHtml;
      modalChatLog.appendChild(div);
      modalChatLog.scrollTop = modalChatLog.scrollHeight;
    }

    if (chatLog) {
      const div = document.createElement('div');
      div.className = 'bubble assistant typing';
      div.innerHTML = indicatorHtml;
      chatLog.appendChild(div);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }

  function removeTypingIndicator() {
    const indicators = document.querySelectorAll('.chat-log .typing');
    indicators.forEach(ind => ind.remove());
  }

  if (modalSendBtn) {
    modalSendBtn.addEventListener('click', sendModalMessage);
  }

  if (modalChatInput) {
    modalChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendModalMessage();
      }
    });
  }
});
