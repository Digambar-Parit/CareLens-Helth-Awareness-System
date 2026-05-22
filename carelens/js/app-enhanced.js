// ============================================
// CareLens - Premium AI Healthcare Platform
// ============================================

// Initialize icons and animations
document.addEventListener('DOMContentLoaded', function () {
  initializeIcons();
  initializeAnimations();
  initializeMobileMenu();
  initializeAIAssistant();
  initializeVoiceAssistant();
  initializeWebcamDetection();
  initializeDragAndDrop();
  initializeLoadingScreen();
  setupPageTransitions();
});

// ============================================
// ICONS & ANIMATIONS
// ============================================

function initializeIcons() {
  if (window.lucide) {
    window.lucide.replace({ width: 20, height: 20, color: 'currentColor' });
  }
}

function initializeAnimations() {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }
}

// ============================================
// MOBILE MENU
// ============================================

function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  }
}

// ============================================
// AI ASSISTANT CHAT
// ============================================

function initializeAIAssistant() {
  const aiToggle = document.querySelector('.ai-toggle');
  const aiPanel = document.querySelector('.ai-panel');
  const aiCloseBtn = document.querySelector('.ai-close');
  const aiSendBtn = document.querySelector('.ai-send-btn');
  const aiInput = document.querySelector('.ai-input-area input');
  const aiMessages = document.querySelector('.ai-messages');

  if (!aiToggle || !aiPanel) return;

  // Toggle panel
  aiToggle.addEventListener('click', () => {
    aiPanel.classList.toggle('open');
  });

  if (aiCloseBtn) {
    aiCloseBtn.addEventListener('click', () => {
      aiPanel.classList.remove('open');
    });
  }

  // Send message
  if (aiSendBtn && aiInput && aiMessages) {
    const sendMessage = () => {
      const message = aiInput.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, 'user');
      aiInput.value = '';

      // Simulate AI thinking
      showTypingIndicator();

      // AI response (simulated)
      setTimeout(() => {
        removeTypingIndicator();
        const responses = [
          'I\'ve analyzed your health data. Your vitals look good!',
          'Based on your symptoms, I recommend staying hydrated and getting more rest.',
          'Your stress levels are elevated. Try some breathing exercises.',
          'Your sleep quality could improve with a consistent bedtime routine.',
          'I\'ve detected some patterns. Would you like detailed recommendations?',
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage(response, 'ai');
      }, 1500);
    };

    aiSendBtn.addEventListener('click', sendMessage);
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messageDiv.id = 'typing-indicator';
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
}

// ============================================
// VOICE ASSISTANT
// ============================================

function initializeVoiceAssistant() {
  const voiceBtn = document.querySelector('.voice-btn');
  if (!voiceBtn) return;

  let recognition;
  let isListening = false;

  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      isListening = false;
      voiceBtn.classList.remove('listening');
    } else {
      recognition.start();
      isListening = true;
      voiceBtn.classList.add('listening');
    }
  });

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    updateVoiceTranscript(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
  };
}

function updateVoiceTranscript(text) {
  let transcript = document.querySelector('.voice-transcript');
  if (!transcript) {
    transcript = document.createElement('div');
    transcript.className = 'voice-transcript';
    document.body.appendChild(transcript);
  }
  transcript.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
}

// ============================================
// WEBCAM DETECTION
// ============================================

function initializeWebcamDetection() {
  const webcamBtn = document.querySelector('[data-webcam-btn]');
  if (!webcamBtn) return;

  webcamBtn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.querySelector('[data-webcam-video]');
      if (video) {
        video.srcObject = stream;
        showScanUI();
      }
    } catch (error) {
      console.error('Webcam error:', error);
      alert('Unable to access webcam. Please check permissions.');
    }
  });
}

function showScanUI() {
  const scanStatus = document.querySelector('.scan-status');
  if (scanStatus) {
    scanStatus.textContent = 'Scanning face...';
    scanStatus.classList.remove('success', 'error');

    setTimeout(() => {
      scanStatus.textContent = 'Face detected - No fatigue detected ✓';
      scanStatus.classList.add('success');
    }, 2000);
  }
}

// ============================================
// DRAG AND DROP UPLOAD
// ============================================

function initializeDragAndDrop() {
  const uploadZones = document.querySelectorAll('.upload-zone');

  uploadZones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-active');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-active');
      handleFiles(e.dataTransfer.files, zone);
    });

    zone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = (e) => {
        handleFiles(e.target.files, zone);
      };
      input.click();
    });
  });
}

function handleFiles(files, zone) {
  const preview = zone.nextElementSibling;
  if (!preview || !preview.classList.contains('upload-preview')) return;

  Array.from(files).forEach((file) => {
    const item = document.createElement('div');
    item.className = 'upload-item';
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(file.name)}</strong>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
      <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
    `;
    preview.appendChild(item);

    // Simulate upload progress
    simulateUpload(item);
  });
}

function simulateUpload(item) {
  const progressFill = item.querySelector('.progress-fill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    progressFill.style.width = progress + '%';
  }, 300);
}

// ============================================
// LOADING SCREEN
// ============================================

function initializeLoadingScreen() {
  // Show loading screen on page load
  if (performance.navigation.type !== 1) {
    showLoadingScreen();
  }
}

function showLoadingScreen() {
  let loadingScreen = document.querySelector('.loading-screen');
  if (!loadingScreen) {
    loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
      <div style="text-align: center;">
        <div class="loading-spinner"></div>
        <div class="loading-text">
          <p>Initializing CareLens AI...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loadingScreen);
  }

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    loadingScreen.style.transition = 'all 0.5s ease';
  }, 1500);
}

// ============================================
// PAGE TRANSITIONS
// ============================================

function setupPageTransitions() {
  const links = document.querySelectorAll('a[href*=".html"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Don't apply transition for external links or anchors
      if (link.target === '_blank' || link.href.includes('#')) return;

      e.preventDefault();
      const href = link.href;

      // Fade out current page
      const main = document.querySelector('main');
      if (main) {
        main.style.opacity = '0';
        main.style.transition = 'opacity 0.3s ease';
      }

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// ============================================
// CHART ANIMATIONS
// ============================================

function animateChart() {
  const chartBars = document.querySelectorAll('[data-chart-bar]');
  chartBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.opacity = '1';
      bar.style.transform = 'scaleY(1)';
    }, index * 100);
  });
}

// ============================================
// HEALTH SCORE ANIMATION
// ============================================

function animateHealthScore(targetScore) {
  const scoreElement = document.querySelector('.health-value h2');
  if (!scoreElement) return;

  let currentScore = 0;
  const increment = targetScore / 50;

  const interval = setInterval(() => {
    currentScore += increment;
    if (currentScore >= targetScore) {
      currentScore = targetScore;
      clearInterval(interval);
    }
    scoreElement.textContent = Math.floor(currentScore);
  }, 30);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ============================================
// EXPORT FUNCTIONS FOR USE IN OTHER FILES
// ============================================

window.CareLensApp = {
  showLoadingScreen,
  animateChart,
  animateHealthScore,
};
