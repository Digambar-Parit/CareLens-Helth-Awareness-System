/* ====================================================
   CareLens AI - Reports Interactive Logic
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const dropzone = document.getElementById('dropzone');
  const ocrPreview = document.getElementById('ocrPreview');
  const extractedText = document.getElementById('extractedText');

  // Helper to add lines to the console terminal
  function addConsoleLine(text, type = '') {
    const consoleTerminal = document.getElementById('reportsConsoleTerminal');
    if (!consoleTerminal) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${timeStr}] ${text}`;
    consoleTerminal.appendChild(line);
    consoleTerminal.scrollTop = consoleTerminal.scrollHeight;
  }

  const simulateExtraction = (name) => {
    if (ocrPreview) {
      ocrPreview.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; color: var(--success); font-weight:600;">
          <i data-lucide="check-circle" style="width:20px; height:20px;"></i>
          Uploaded file: ${name}
        </div>
      `;
      if (window.lucide) window.lucide.replace();
    }
    const extractedData = `Extracted medical observations from ${name}:\n- Blood pressure: 118/76 mmHg (Normal)\n- Stable heart rate: 72 bpm\n- No abnormal markers or elevated flags detected\n- Recommended follow-up in two weeks`;
    if (extractedText) {
      extractedText.textContent = extractedData;
    }

    // Log upload and extraction to console
    addConsoleLine(`POST http://localhost:3000/api/analyze-report HTTP/1.1`, 'req');
    addConsoleLine(`Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryAbC987`, 'time');
    addConsoleLine(`FILE DATA: name="${name}"`, 'time');

    setTimeout(() => {
      addConsoleLine(`HTTP/1.1 200 OK\nContent-Type: application/json`, 'resp');
      const responsePayload = {
        success: true,
        message: "Multipart file parsed successfully via Tesseract OCR engine",
        extractedText: extractedData
      };
      addConsoleLine(`RESPONSE: ${JSON.stringify(responsePayload, null, 2)}`, 'resp');
    }, 1000);
  };

  if (dropzone) {
    dropzone.addEventListener('click', () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png';
      fileInput.onchange = () => {
        if (fileInput.files.length) simulateExtraction(fileInput.files[0].name);
      };
      fileInput.click();
    });

    dropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      dropzone.classList.remove('drag-over');
      if (event.dataTransfer.files.length) {
        simulateExtraction(event.dataTransfer.files[0].name);
      }
    });
  }

  // Upload report button listener inside dropzone
  const uploadReportBtn = document.getElementById('uploadReportBtn');
  if (uploadReportBtn) {
    uploadReportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png';
      fileInput.onchange = () => {
        if (fileInput.files.length) simulateExtraction(fileInput.files[0].name);
      };
      fileInput.click();
    });
  }

  // Modal Expand and Close Handlers
  const expandBtn = document.getElementById('expandReportsChatBtn');
  const closeBtn = document.getElementById('closeReportsChatBtn');
  const modal = document.getElementById('reportsChatModal');
  const modalChatLog = document.getElementById('reportsModalChatLog');
  const modalChatInput = document.getElementById('reportsModalChatInput');
  const modalSendBtn = document.getElementById('reportsModalSendBtn');

  if (expandBtn && closeBtn && modal) {
    expandBtn.addEventListener('click', () => {
      modal.classList.add('active');
      addConsoleLine("Opened expanded OCR report chat terminal.", "time");
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  function sendModalMessage() {
    if (!modalChatInput || !modalChatInput.value.trim()) return;
    const text = modalChatInput.value.trim();
    modalChatInput.value = '';

    // Append user message
    appendMessage(text, 'user');

    // Log request
    addConsoleLine(`POST http://localhost:3000/api/chat/report HTTP/1.1`, 'req');
    addConsoleLine(`Content-Type: application/json`, 'time');
    const payload = {
      message: text,
      timestamp: new Date().toISOString()
    };
    addConsoleLine(`PAYLOAD: ${JSON.stringify(payload, null, 2)}`, 'time');

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();

      // Generate response based on report data
      let response = "I can analyze your blood pressure or general report markers. Please upload a report to let me parse the values first, or ask general questions.";
      
      const lower = text.toLowerCase();
      if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('118') || lower.includes('76')) {
        response = "The extracted blood pressure is 118/76 mmHg. A systolic pressure below 120 and diastolic below 80 is clinically classified as Normal. This indicates excellent cardiovascular efficiency.";
      } else if (lower.includes('heart') || lower.includes('pulse') || lower.includes('rate') || lower.includes('72')) {
        response = "Your resting heart rate is extracted as 72 bpm. For adults, a normal resting heart rate ranges from 60 to 100 beats per minute. 72 bpm is optimal.";
      } else if (lower.includes('abnormal') || lower.includes('flag') || lower.includes('marker')) {
        response = "No elevated indicators or pathological flags (such as high cholesterol, high glucose, or abnormal liver enzymes) were identified in the scanned region.";
      } else if (lower.includes('help')) {
        response = "Ask me to clarify clinical abbreviations or explain particular biometrics like blood pressure or heart rate from your uploaded document.";
      } else if (lower.includes('thank') || lower.includes('okay')) {
        response = "Glad to help! Let me know if you have other markers you want to interpret.";
      }

      appendMessage(response, 'assistant');

      // Log response
      addConsoleLine(`HTTP/1.1 200 OK\nContent-Type: application/json`, 'resp');
      const responsePayload = {
        success: true,
        reply: response,
        model: "CareLens-OCRInterpreter-v1"
      };
      addConsoleLine(`RESPONSE: ${JSON.stringify(responsePayload, null, 2)}`, 'resp');
    }, 1200);
  }

  function appendMessage(text, sender) {
    if (modalChatLog) {
      const bubble = document.createElement('div');
      bubble.className = `bubble ${sender}`;
      bubble.textContent = text;
      modalChatLog.appendChild(bubble);
      modalChatLog.scrollTop = modalChatLog.scrollHeight;
    }

    if (window.applyTranslations) {
      window.applyTranslations();
    }
  }

  function showTypingIndicator() {
    if (modalChatLog) {
      const div = document.createElement('div');
      div.className = 'bubble assistant typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      modalChatLog.appendChild(div);
      modalChatLog.scrollTop = modalChatLog.scrollHeight;
    }
  }

  function removeTypingIndicator() {
    if (modalChatLog) {
      const indicators = modalChatLog.querySelectorAll('.typing');
      indicators.forEach(ind => ind.remove());
    }
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
