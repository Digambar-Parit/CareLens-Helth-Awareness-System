/* ====================================================
   CareLens AI - Global Application Logic
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.replace({ width: 20, height: 20, color: 'currentColor' });
  }

  // 2. Initialize AOS Animations
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
    document.documentElement.classList.add('aos-initialized');
  }

  // Safety fallback for AOS if it fails to initialize or load
  setTimeout(() => {
    document.documentElement.classList.add('aos-initialized');
  }, 1000);


  // 3. Mobile Menu Navigation Toggles
  const menuToggles = document.querySelectorAll('[data-menu-toggle], .menu-toggle');
  const mobileMenus = document.querySelectorAll('[data-mobile-menu], .mobile-menu');

  menuToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      mobileMenus.forEach(menu => {
        menu.classList.toggle('open');
      });
    });
  });

  // 4. Floating AI Chatbot Panel Controller
  const chatToggles = document.querySelectorAll('[data-chat-toggle], .ai-toggle');
  const chatPanels = document.querySelectorAll('[data-chat-panel], .ai-chat-panel, [data-chat-panel]');

  chatToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      chatPanels.forEach(panel => {
        panel.classList.toggle('visible');
        if (panel.classList.contains('visible')) {
          panel.style.opacity = '1';
          panel.style.visibility = 'visible';
          panel.style.transform = 'translateY(0)';
        } else {
          panel.style.opacity = '0';
          panel.style.visibility = 'hidden';
          panel.style.transform = 'translateY(20px)';
        }
      });
    });
  });

  // 5. Chat Send Functionality
  const chatInput = document.querySelector('.ai-chat-input input');
  const chatSendBtn = document.querySelector('.ai-chat-input button');
  const chatMessages = document.querySelector('.ai-chat-messages');

  if (chatSendBtn && chatInput && chatMessages) {
    const appendMessage = (text, sender) => {
      const bubble = document.createElement('div');
      bubble.className = `ai-bubble ${sender}`;
      bubble.textContent = text;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleSend = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      
      appendMessage(text, 'user');
      chatInput.value = '';

      // Typing simulation
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'ai-bubble assistant typing-indicator-dots';
      typingIndicator.innerHTML = `
        <div class="typing-indicator" style="margin-top:0;">
          <span></span><span></span><span></span>
        </div>
      `;
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        typingIndicator.remove();
        const responses = [
          "I'm analyzing your health profile. Everything seems consistent with healthy recovery.",
          "Based on standard medical telemetry, keeping active hydration is highly recommended today.",
          "I've flagged your report for review. Your stress indices indicate mindfulness could help.",
          "Would you like me to add a reminder to help organize your schedule?",
          "Your fatigue telemetry looks normal, but let me know if you experience headaches."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        appendMessage(randomResponse, 'assistant');
      }, 1500);
    };

    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // 6. Clipboard Copier Helpers
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.copy);
      if (target) {
        navigator.clipboard.writeText(target.textContent.trim());
        const originalText = button.innerHTML;
        button.innerHTML = 'Copied ✓';
        setTimeout(() => (button.innerHTML = originalText), 1400);
      }
    });
  });

  // 7. Global Settings Sidebar (Drawer) Builder & Controller
  const buildSettingsSidebar = () => {
    // Avoid double injection
    if (document.getElementById('settingsSidebar')) return;

    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'settingsSidebar';
    sidebar.className = 'settings-sidebar';
    sidebar.innerHTML = `
      <div class="settings-sidebar-header flex-between">
        <h3>System Settings</h3>
        <button id="closeSettingsBtn" class="close-btn">&times;</button>
      </div>
      <div class="settings-sidebar-content">
        <div class="settings-group">
          <h4>Select Language</h4>
          <div class="language-buttons">
            <button id="langEnBtn" class="lang-btn">English</button>
            <button id="langHiBtn" class="lang-btn">Hindi (हिन्दी)</button>
            <button id="langMrBtn" class="lang-btn">Marathi (मराठी)</button>
          </div>
        </div>
        
        <div class="settings-group" style="margin-top: 24px;">
          <h4>Select Theme</h4>
          <div class="theme-buttons">
            <button id="themeLightBtn" class="theme-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              Light
            </button>
            <button id="themeDarkBtn" class="theme-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              Dark
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);

    // Inject Settings trigger button into Nav Action panels dynamically
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      const trigger = document.createElement('button');
      trigger.id = 'settingsToggleBtn';
      trigger.className = 'btn-secondary';
      trigger.style.cssText = 'padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: 1px solid var(--border-color); cursor: pointer; margin-left: 8px;';
      trigger.setAttribute('aria-label', 'Open Settings');
      trigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
      navActions.appendChild(trigger);
    }

    // Also add to mobile menu links for easy settings access
    const mobileMenuLinks = document.querySelector('.mobile-menu-links');
    if (mobileMenuLinks) {
      const mobTrigger = document.createElement('a');
      mobTrigger.href = '#';
      mobTrigger.id = 'mobileSettingsToggle';
      mobTrigger.style.cssText = 'color: var(--secondary); font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-top: 10px;';
      mobTrigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> Language / Theme Settings`;
      mobileMenuLinks.appendChild(mobTrigger);
    }

    // Inject floating Settings button (visible on all viewports on the bottom-left)
    if (!document.getElementById('settingsFloatBtn')) {
      const floatBtn = document.createElement('button');
      floatBtn.id = 'settingsFloatBtn';
      floatBtn.className = 'settings-float-btn';
      floatBtn.setAttribute('aria-label', 'Open Settings');
      floatBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
      document.body.appendChild(floatBtn);
    }

    // Inject language switcher in mobile menu links
    const mobileMenuLinks = document.querySelector('.mobile-menu-links');
    if (mobileMenuLinks && !document.querySelector('.mobile-menu-lang-section')) {
      const langSection = document.createElement('div');
      langSection.className = 'mobile-menu-lang-section';
      langSection.style.cssText = 'margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; text-align: left;';
      langSection.innerHTML = `
        <p style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 8px; color: var(--text-soft); font-weight: 600;">Choose Language / भाषा निवडा</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="lang-btn-mobile lang-btn-en" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">EN</button>
          <button class="lang-btn-mobile lang-btn-hi" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">हिन्दी</button>
          <button class="lang-btn-mobile lang-btn-mr" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">मराठी</button>
        </div>
      `;
      mobileMenuLinks.appendChild(langSection);

      langSection.querySelector('.lang-btn-en').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('en'); });
      langSection.querySelector('.lang-btn-hi').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('hi'); });
      langSection.querySelector('.lang-btn-mr').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('mr'); });
    }

    // Inject language switcher in sidebar nav (Dashboard sidebar)
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav && !document.querySelector('.sidebar-lang-section')) {
      const langSection = document.createElement('div');
      langSection.className = 'sidebar-lang-section';
      langSection.style.cssText = 'margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color); text-align: left;';
      langSection.innerHTML = `
        <p style="font-size: 0.8rem; color: var(--text-soft); margin-bottom: 10px; font-weight: 600;">Language / भाषा</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="lang-btn-sidebar lang-btn-en" style="padding: 6px 10px; font-size: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">EN</button>
          <button class="lang-btn-sidebar lang-btn-hi" style="padding: 6px 10px; font-size: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">हिन्दी</button>
          <button class="lang-btn-sidebar lang-btn-mr" style="padding: 6px 10px; font-size: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: none; color: var(--text-main); cursor: pointer;">मराठी</button>
        </div>
      `;
      sidebarNav.appendChild(langSection);

      langSection.querySelector('.lang-btn-en').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('en'); });
      langSection.querySelector('.lang-btn-hi').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('hi'); });
      langSection.querySelector('.lang-btn-mr').addEventListener('click', (e) => { e.preventDefault(); applyTranslations('mr'); });
    }
  };

  buildSettingsSidebar();

  // Variables
  const settingsSidebar = document.getElementById('settingsSidebar');
  const settingsToggleBtn = document.getElementById('settingsToggleBtn');
  const mobileSettingsToggle = document.getElementById('mobileSettingsToggle');
  const settingsFloatBtn = document.getElementById('settingsFloatBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');

  // Toggle open
  const openSidebar = (e) => {
    if (e) e.preventDefault();
    settingsSidebar?.classList.add('open');
  };
  const closeSidebar = () => {
    settingsSidebar?.classList.remove('open');
  };

  settingsToggleBtn?.addEventListener('click', openSidebar);
  settingsFloatBtn?.addEventListener('click', openSidebar);
  mobileSettingsToggle?.addEventListener('click', (e) => {
    // Close mobile menu first
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) mobileMenu.classList.remove('open');
    openSidebar(e);
  });
  closeSettingsBtn?.addEventListener('click', closeSidebar);

  // Close sidebar on clicking outside
  document.addEventListener('click', (e) => {
    if (settingsSidebar && settingsSidebar.classList.contains('open')) {
      if (!settingsSidebar.contains(e.target) && 
          e.target !== settingsToggleBtn && !settingsToggleBtn?.contains(e.target) && 
          e.target !== mobileSettingsToggle && !mobileSettingsToggle?.contains(e.target) &&
          e.target !== settingsFloatBtn && !settingsFloatBtn?.contains(e.target)) {
        closeSidebar();
      }
    }
  });

  // Translation Maps
  const navTranslations = {
    en: {
      'Home': 'Home',
      'Dashboard': 'Dashboard',
      'Detection': 'Detection',
      'Reports': 'Reports',
      'Reminders': 'Reminders',
      'History': 'History',
      'Nearby': 'Nearby',
      'SOS': 'SOS',
      'Login': 'Login',
      'Get Started': 'Get Started',
      'System Settings': 'System Settings',
      'Select Language': 'Select Language',
      'Select Theme': 'Select Theme',
      'Light': 'Light',
      'Dark': 'Dark',
      'AI Diagnostic Terminal': 'AI Diagnostic Terminal',
      'Report Analysis Terminal': 'Report Analysis Terminal',
      'AI report center': 'AI report center',
      'AI Report Intelligence': 'AI Report Intelligence',
      'Drag & drop upload': 'Drag & drop upload',
      'OCR scan preview': 'OCR scan preview',
      'AI report analysis': 'AI report analysis',
      'Report categories': 'Report categories',
      'Choose symptoms': 'Choose symptoms',
      'AI analysis': 'AI analysis',
      'Camera-assisted detection': 'Camera-assisted detection',
      'Upload medical report': 'Upload medical report',
      'AI assistant transcript': 'AI assistant transcript',
      'Enter Your Symptoms': 'Enter Your Symptoms',
      'AI disease detection toolkit': 'AI disease detection toolkit',
      'Custom symptom input': 'Custom symptom input',
      'Send Symptoms': 'Send Symptoms',
      'Upload Report': 'Upload Report',
      'Tip: Enter comma-separated symptoms or short phrases for best scan clarity.': 'Tip: Enter comma-separated symptoms or short phrases for best scan clarity.',
      'Severity meter': 'Severity meter',
      'Low risk': 'Low risk',
      'Low risk detected': 'Low risk detected',
      'Realtime': 'Realtime',
      'Use your device camera for vision-based symptom detection and posture assessment.': 'Use your device camera for vision-based symptom detection and posture assessment.',
      'Drag & drop PDF, image, or lab result for AI extraction and diagnostic review.': 'Drag & drop PDF, image, or lab result for AI extraction and diagnostic review.',
      'Drop files here or browse': 'Drop files here or browse',
      'No file uploaded': 'No file uploaded',
      'Live Developer Mode • Connected to CareLens API': 'Live Developer Mode • Connected to CareLens API',
      'Clinical Conversation': 'Clinical Conversation',
      'Live scan ready': 'Live scan ready',
      'Reset': 'Reset',
      'Analyze now': 'Analyze now',
      'Optional': 'Optional',
      'Supports JPG, PNG, PDF and health record formats.': 'Supports JPG, PNG, PDF and health record formats.',
      'Drop files here or click to select reports': 'Drop files here or click to select reports',
      'No document uploaded yet. Drop a file above to begin.': 'No document uploaded yet. Drop a file above to begin.',
      'Extracted text': 'Extracted text',
      'No extracted content yet.': 'No extracted content yet.',
      'Cardiac': 'Cardiac',
      'Endocrine': 'Endocrine',
      'Respiratory': 'Respiratory',
      'Dermatology': 'Dermatology',
      'Medication reminders': 'Medication reminders',
      'Stay consistent with your daily dose. Check off when taken.': 'Stay consistent with your daily dose. Check off when taken.',
      'Current schedule': 'Current schedule',
      'Add new medication': 'Add new medication',
      'Medication Name': 'Medication Name',
      'Dosage (e.g. 1 pill, 5ml)': 'Dosage (e.g. 1 pill, 5ml)',
      'Timing (e.g. 08:00 AM)': 'Timing (e.g. 08:00 AM)',
      'Frequency': 'Frequency',
      'Everyday': 'Everyday',
      'Twice a day': 'Twice a day',
      'Add Reminder': 'Add Reminder',
      'SOS Emergency Mode': 'SOS Emergency Mode',
      'Tap SOS to alert nearby clinics and emergency contacts instantly.': 'Tap SOS to alert nearby clinics and emergency contacts instantly.',
      'SOS Activated': 'SOS Activated',
      'Simulating dispatch...': 'Simulating dispatch...',
      'Hospital': 'Hospital',
      'Distance': 'Distance',
      'Status': 'Status',
      'Contact': 'Contact',
      'Medical History Logs': 'Medical History Logs',
      'Track your past symptoms, AI scans, and clinical outcomes over time.': 'Track your past symptoms, AI scans, and clinical outcomes over time.',
      'Search logs...': 'Search logs...',
      'Date': 'Date',
      'Symptom': 'Symptom',
      'Risk Level': 'Risk Level',
      'Outcome': 'Outcome',
      'Nearby Healthcare Facilities': 'Nearby Healthcare Facilities',
      'Find hospitals, pharmacies, and specialty clinics near you.': 'Find hospitals, pharmacies, and specialty clinics near you.',
      'Welcome back, Amara': 'Welcome back, Amara',
      'AI-driven summary of your current physical indicators.': 'AI-driven summary of your current physical indicators.',
      'Physical indicators': 'Physical indicators',
      'Hydration': 'Hydration',
      'Mindfulness': 'Mindfulness',
      'Sleep': 'Sleep',
      'Active': 'Active',
      'Needs review': 'Needs review',
      'Optimal': 'Optimal',
      'Smart Healthcare Features': 'Smart Healthcare Features',
      'Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.': 'Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.',
      'Trusted By Modern Clinics': 'Trusted By Modern Clinics',
      'Healthcare professionals trust CareLens AI for smarter preventive healthcare.': 'Healthcare professionals trust CareLens AI for smarter preventive healthcare.',
      'Start Your Smart Health Journey': 'Start Your Smart Health Journey',
      'AI-powered healthcare assistance designed for modern preventive care.': 'AI-powered healthcare assistance designed for modern preventive care.',
      'AI-Powered Preventive Healthcare Platform': 'AI-Powered Preventive Healthcare Platform',
      'Health Score': 'Health Score',
      'Healthy': 'Healthy',
      'AI Insight': 'AI Insight',
      'Early fatigue detected': 'Early fatigue detected',
      'Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.': 'Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.'
    },
    hi: {
      'Home': 'मुख्य पृष्ठ',
      'Dashboard': 'डैशबोर्ड',
      'Detection': 'बीमारी जांच',
      'Reports': 'रिपोर्ट्स',
      'Reminders': 'दवा याद दिलाएं',
      'History': 'इतिहास',
      'Nearby': 'पास के अस्पताल',
      'SOS': 'आपातकालीन SOS',
      'Login': 'लॉगिन',
      'Get Started': 'शुरू करें',
      'System Settings': 'सिस्टम सेटिंग्स',
      'Select Language': 'भाषा चुनें',
      'Select Theme': 'थीम चुनें',
      'Light': 'लाइट',
      'Dark': 'डार्क',
      'AI Diagnostic Terminal': 'एआई डायग्नोस्टिक टर्मिनल',
      'Report Analysis Terminal': 'रिपोर्ट विश्लेषण टर्मिनल',
      'AI report center': 'एआई रिपोर्ट केंद्र',
      'AI Report Intelligence': 'एआई रिपोर्ट इंटेलिजेंस',
      'Drag & drop upload': 'ड्रैग और ड्रॉप अपलोड',
      'OCR scan preview': 'ओसीआर स्कैन पूर्वावलोकन',
      'AI report analysis': 'एआई रिपोर्ट विश्लेषण',
      'Report categories': 'रिपोर्ट श्रेणियां',
      'Choose symptoms': 'लक्षण चुनें',
      'AI analysis': 'एआई विश्लेषण',
      'Camera-assisted detection': 'कैमरा-सहायता प्राप्त जांच',
      'Upload medical report': 'मेडिकल रिपोर्ट अपलोड करें',
      'AI assistant transcript': 'एआई सहायक प्रतिलेख',
      'Enter Your Symptoms': 'अपने लक्षण दर्ज करें',
      'AI disease detection toolkit': 'एआई बीमारी जांच टूलकिट',
      'Custom symptom input': 'कस्टम लक्षण इनपुट',
      'Send Symptoms': 'लक्षण भेजें',
      'Upload Report': 'रिपोर्ट अपलोड करें',
      'Tip: Enter comma-separated symptoms or short phrases for best scan clarity.': 'सुझाव: सर्वोत्तम स्कैन स्पष्टता के लिए अल्पविराम से अलग किए गए लक्षण या छोटे वाक्यांश दर्ज करें।',
      'Severity meter': 'गंभीरता मीटर',
      'Low risk': 'कम जोखिम',
      'Low risk detected': 'कम जोखिम का पता चला',
      'Realtime': 'वास्तविक समय',
      'Use your device camera for vision-based symptom detection and posture assessment.': 'दृष्टि-आधारित लक्षण का पता लगाने और मुद्रा मूल्यांकन के लिए अपने डिवाइस कैमरे का उपयोग करें।',
      'Drag & drop PDF, image, or lab result for AI extraction and diagnostic review.': 'एआई निष्कर्षण और नैदानिक समीक्षा के लिए पीडीएफ, छवि या प्रयोगशाला परिणाम को खींचें और छोड़ें।',
      'Drop files here or browse': 'फ़ाइलें यहाँ खींचें या ब्राउज़ करें',
      'No file uploaded': 'कोई फ़ाइल अपलोड नहीं की गई',
      'Live Developer Mode • Connected to CareLens API': 'लाइव डेवलपर मोड • केयरलेंस एपीआई से जुड़े',
      'Clinical Conversation': 'नैदानिक बातचीत',
      'Live scan ready': 'लाइव स्कैन तैयार',
      'Reset': 'रीसेट',
      'Analyze now': 'अभी विश्लेषण करें',
      'Optional': 'वैकल्पिक',
      'Supports JPG, PNG, PDF and health record formats.': 'जेपीजी, पीएनजी, पीडीएफ और स्वास्थ्य रिकॉर्ड प्रारूपों का समर्थन करता है।',
      'Drop files here or click to select reports': 'फ़ाइलें यहाँ छोड़ें या रिपोर्ट चुनने के लिए क्लिक करें',
      'No document uploaded yet. Drop a file above to begin.': 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है। शुरू करने के लिए ऊपर एक फ़ाइल छोड़ें।',
      'Extracted text': 'निकाला गया पाठ',
      'No extracted content yet.': 'अभी तक कोई निकाली गई सामग्री नहीं है।',
      'Cardiac': 'हृदय रोग',
      'Endocrine': 'अंतःस्रावी',
      'Respiratory': 'श्वसन',
      'Dermatology': 'त्वचा विज्ञान',
      'Medication reminders': 'दवा अनुस्मारक',
      'Stay consistent with your daily dose. Check off when taken.': 'अपनी दैनिक खुराक के साथ सुसंगत रहें। दवा लेने पर टिक करें।',
      'Current schedule': 'वर्तमान अनुसूची',
      'Add new medication': 'नई दवा जोड़ें',
      'Medication Name': 'दवा का नाम',
      'Dosage (e.g. 1 pill, 5ml)': 'खुराक (जैसे 1 गोली, 5 मिली)',
      'Timing (e.g. 08:00 AM)': 'समय (जैसे 08:00 AM)',
      'Frequency': 'आवृत्ति',
      'Everyday': 'हर दिन',
      'Twice a day': 'दिन में दो बार',
      'Add Reminder': 'अनुस्मारक जोड़ें',
      'SOS Emergency Mode': 'एसओएस आपातकालीन मोड',
      'Tap SOS to alert nearby clinics and emergency contacts instantly.': 'पास के क्लीनिकों और आपातकालीन संपर्कों को तुरंत सचेत करने के लिए एसओएस टैप करें।',
      'SOS Activated': 'एसओएस सक्रिय',
      'Simulating dispatch...': 'प्रेषण का अनुकरण किया जा रहा है...',
      'Hospital': 'अस्पताल',
      'Distance': 'दूरी',
      'Status': 'स्थिति',
      'Contact': 'संपर्क',
      'Medical History Logs': 'चिकित्सा इतिहास लॉग',
      'Track your past symptoms, AI scans, and clinical outcomes over time.': 'समय के साथ अपने पिछले लक्षणों, एआई स्कैन और नैदानिक परिणामों को ट्रैक करें।',
      'Search logs...': 'लॉग खोजें...',
      'Date': 'तारीख',
      'Symptom': 'लक्षण',
      'Risk Level': 'जोखिम का स्तर',
      'Outcome': 'परिणाम',
      'Nearby Healthcare Facilities': 'पास की स्वास्थ्य सुविधाएं',
      'Find hospitals, pharmacies, and specialty clinics near you.': 'अपने आस-पास के अस्पतालों, फार्मेसियों और विशेष क्लीनिकों को खोजें।',
      'Welcome back, Amara': 'स्वागत है, अमारा',
      'AI-driven summary of your current physical indicators.': 'आपके वर्तमान शारीरिक संकेतकों का एआई-संचालित सारांश।',
      'Physical indicators': 'शारीरिक संकेतक',
      'Hydration': 'जलीकरण',
      'Mindfulness': 'सजयता',
      'Sleep': 'नींद',
      'Active': 'सक्रिय',
      'Needs review': 'समीक्षा की आवश्यकता है',
      'Optimal': 'इष्टतम',
      'Smart Healthcare Features': 'स्मार्ट हेल्थकेयर विशेषताएं',
      'Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.': 'शुरुआती बीमारी का पता लगाने, आपातकालीन सहायता और कल्याण निगरानी के लिए उन्नत एआई-संचालित स्वास्थ्य सेवा उपकरण।',
      'Trusted By Modern Clinics': 'आधुनिक क्लीनिकों द्वारा विश्वसनीय',
      'Healthcare professionals trust CareLens AI for smarter preventive healthcare.': 'समानतापूर्ण निवारक स्वास्थ्य सेवा के लिए स्वास्थ्य देखभाल पेशेवर केयरलेंस एआई पर भरोसा करते हैं।',
      'Start Your Smart Health Journey': 'अपनी स्मार्ट स्वास्थ्य यात्रा शुरू करें',
      'AI-powered healthcare assistance designed for modern preventive care.': 'आधुनिक निवारक देखभाल के लिए डिज़ाइन की गई एआई-संचालित स्वास्थ्य सहायता।',
      'AI-Powered Preventive Healthcare Platform': 'एआई-संचालित निवारक स्वास्थ्य सेवा मंच',
      'Health Score': 'स्वास्थ्य स्कोर',
      'Healthy': 'स्वस्थ',
      'AI Insight': 'एआई अंतर्दृष्टि',
      'Early fatigue detected': 'शुरुआती थकान का पता चला',
      'Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.': 'लक्षण लिखें, लक्षण चिप्स पर टैप करें, और केयरलेंस एआई को सेकंडों में जोखिम, गंभीरता और उपचार तत्परता का विश्लेषण करने दें।'
    },
    mr: {
      'Home': 'मुख्यपृष्ठ',
      'Dashboard': 'डॅशबोर्ड',
      'Detection': 'आजार शोधणे',
      'Reports': 'अहवाल',
      'Reminders': 'स्मरणपत्रे',
      'History': 'इतिहास',
      'Nearby': 'जवळचे दवाखाने',
      'SOS': 'आपत्कालीन SOS',
      'Login': 'लॉगिन',
      'Get Started': 'सुरू करा',
      'System Settings': 'सिस्टम सेटिंग्ज',
      'Select Language': 'भाषा निवडा',
      'Select Theme': 'थीम निवडा',
      'Light': 'लाईट',
      'Dark': 'डार्क',
      'AI Diagnostic Terminal': 'आय डायग्नोस्टिक टर्मिनल',
      'Report Analysis Terminal': 'अहवाल विश्लेषण टर्मिनल',
      'AI report center': 'अहवाल केंद्र',
      'AI Report Intelligence': 'अहवाल इंटेलिजेंस',
      'Drag & drop upload': 'ड्रॅग आणि ड्रॉप अपलोड',
      'OCR scan preview': 'ओसीआर स्कॅन पूर्वावलोकन',
      'AI report analysis': 'अहवाल विश्लेषण',
      'Report categories': 'अहवाल श्रेणी',
      'Choose symptoms': 'लक्षणे निवडा',
      'AI analysis': 'एआय विश्लेषण',
      'Camera-assisted detection': 'कॅмера-सहाय्यित शोध',
      'Upload medical report': 'वैद्यकीय अहवाल अपलोड करा',
      'AI assistant transcript': 'एआय असिस्टंट ट्रान्सक्रिप्ट',
      'Enter Your Symptoms': 'तुमची लक्षणे प्रविष्ट करा',
      'AI disease detection toolkit': 'कॅरलेन्स आजार तपासणी टूलकिट',
      'Custom symptom input': 'कस्टम लक्षणे इनपुट',
      'Send Symptoms': 'लक्षणे पाठवा',
      'Upload Report': 'अहवाल अपलोड करा',
      'Tip: Enter comma-separated symptoms or short phrases for best scan clarity.': 'टीप: सर्वोत्तम स्कॅन स्पष्टतेसाठी स्वल्पविरामाने विभक्त केलेली लक्षणे किंवा लहान वाक्ये प्रविष्ट करा.',
      'Severity meter': 'तीव्रता मीटर',
      'Low risk': 'कमी धोका',
      'Low risk detected': 'कमी धोका आढळला',
      'Realtime': 'रिअल टाईम',
      'Use your device camera for vision-based symptom detection and posture assessment.': 'दृष्टी-आधारित लक्षण शोधण्यासाठी आणि शरीराच्या स्थितीच्या मूल्यांकनासाठी आपल्या डिव्हाइस कॅमेराचा वापर करा.',
      'Drag & drop PDF, image, or lab result for AI extraction and diagnostic review.': 'एआय माहिती काढण्यासाठी आणि निदान पुनरावलोकनासाठी पीडीएफ, प्रतिमा किंवा लॅब अहवाल ड्रॅग आणि ड्रॉप करा.',
      'Drop files here or browse': 'फाईल्स येथे ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करा',
      'No file uploaded': 'कोणतीही फाईल अपलोड केलेली नाही',
      'Live Developer Mode • Connected to CareLens API': 'लाइव्ह डेव्हलपर मोड • केअरलेन्स एपीआयशी जोडलेले',
      'Clinical Conversation': 'वैद्यकीय संभाषण',
      'Live scan ready': 'लाइव्ह स्कॅन तयार',
      'Reset': 'रीसेट',
      'Analyze now': 'आता विश्लेषण करा',
      'Optional': 'पर्यायी',
      'Supports JPG, PNG, PDF and health record formats.': 'जेपीजी, पीएनजी, पीडीएफ आणि आरोग्य रेकॉर्ड स्वरूपांना समर्थन देते.',
      'Drop files here or click to select reports': 'फाईल्स येथे ड्रॅग आणि ड्रॉप करा किंवा अहवाल निवडण्यासाठी क्लिक करा',
      'No document uploaded yet. Drop a file above to begin.': 'अद्याप कोणतेही दस्तऐवज अपलोड केलेले नाही. सुरू करण्यासाठी वर फाईल ड्रॅग आणि ड्रॉप करा.',
      'Extracted text': 'काढलेला मजकूर',
      'No extracted content yet.': 'अद्याप कोणताही काढलेला मजकूर नाही.',
      'Cardiac': 'हृदयविकार',
      'Endocrine': 'अंतःस्रावी',
      'Respiratory': 'श्वसन',
      'Dermatology': 'त्वचा रोग',
      'Medication reminders': 'औषधाची स्मरणपत्रे',
      'Stay consistent with your daily dose. Check off when taken.': 'तुमच्या रोजच्या डोससह सुसंगत रहा. औषध घेतल्यावर टिक करा.',
      'Current schedule': 'चालू वेळापत्रक',
      'Add new medication': 'नवीन औषध जोडा',
      'Medication Name': 'औषधाचे नाव',
      'Dosage (e.g. 1 pill, 5ml)': 'डोस (उदा. १ गोळी, ५ मिली)',
      'Timing (e.g. 08:00 AM)': 'वेळ (उदा. सकाळी ०८:००)',
      'Frequency': 'वारंवारता',
      'Everyday': 'दररोज',
      'Twice a day': 'दिवसातून दोनदा',
      'Add Reminder': 'स्मरणपत्र जोडा',
      'SOS Emergency Mode': 'एसओएस आपत्कालीन मोड',
      'Tap SOS to alert nearby clinics and emergency contacts instantly.': 'जवळचे क्लिनिक आणि आपत्कालीन संपर्कांना त्वरित अलर्ट करण्यासाठी एसओएस टॅप करा.',
      'SOS Activated': 'एसओएस सक्रिय केले',
      'Simulating dispatch...': 'सिम्युलेटिंग डिस्पॅच...',
      'Hospital': 'रुग्णालय',
      'Distance': 'अंतर',
      'Status': 'स्थिती',
      'Contact': 'संपर्क',
      'Medical History Logs': 'वैद्यकीय इतिहास नोंद',
      'Track your past symptoms, AI scans, and clinical outcomes over time.': 'तुमच्या भूतकाळातील लक्षणे, एआई स्कॅन आणि वैद्यकीय परिणामांचा मागोवा घ्या.',
      'Search logs...': 'लॉग शोधा...',
      'Date': 'तारीख',
      'Symptom': 'लक्षण',
      'Risk Level': 'धोका पातळी',
      'Outcome': 'निष्कर्ष',
      'Nearby Healthcare Facilities': 'जवळच्या आरोग्य सुविधा',
      'Find hospitals, pharmacies, and specialty clinics near you.': 'तुमच्या जवळील रुग्णालये, औषधालये आणि विशेष क्लिनिक शोधण्यासाठी.',
      'Welcome back, Amara': 'स्वागत आहे, अमारा',
      'AI-driven summary of your current physical indicators.': 'तुमच्या सध्याच्या शारीरिक निर्देशकांचा एआय-आधारित सारांश.',
      'Physical indicators': 'शारीरिक निर्देशक',
      'Hydration': 'हायड्रेशन',
      'Mindfulness': 'माइंडफुलनेस',
      'Sleep': 'झोप',
      'Active': 'सक्रिय',
      'Needs review': 'पुनरावलोकन आवश्यक',
      'Optimal': 'उत्कृष्ट',
      'Smart Healthcare Features': 'स्मार्ट आरोग्य वैशिष्ट्ये',
      'Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.': 'लवकर आजार शोधणे, आपत्कालीन सहाय्य आणि कल्याण देखरेख यासाठी प्रगत एआय-आधारित आरोग्य साधने.',
      'Trusted By Modern Clinics': 'आधुनिक क्लिनिकद्वारे विश्वासार्ह',
      'Healthcare professionals trust CareLens AI for smarter preventive healthcare.': 'स्मार्ट प्रतिबंधात्मक आरोग्यासाठी आरोग्य व्यावसायिक केअरलेन्स एआय वर विश्वास ठेवतात.',
      'Start Your Smart Health Journey': 'तुमचा स्मार्ट आरोग्य प्रवास सुरू करा',
      'AI-powered healthcare assistance designed for modern preventive care.': 'आधुनिक प्रतिबंधात्मक काळजीसाठी डिझाइन केलेले एआय-आधारित आरोग्य सहाय्य.',
      'AI-Powered Preventive Healthcare Platform': 'एआय-आधारित प्रतिबंधात्मक आरोग्य प्लॅटफॉर्म',
      'Health Score': 'आरोग्य स्कोअर',
      'Healthy': 'आरोग्यदायी',
      'AI Insight': 'एआय इनसाईट',
      'Early fatigue detected': 'लवकर थकवा आढळला',
      'Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.': 'लक्षणे टाईप करा, लक्षण चिप्सवर टॅप करा आणि केअरलेन्स एआयला सेकंदात جوखीम, तीव्रता आणि उपचारांची तयारी यांचे विश्लेषण करू द्या.'
    }
  };

  const applyTranslations = (lang) => {
    const dict = navTranslations[lang];
    if (!dict) return;

    localStorage.setItem('carelens-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Apply active class to sidebar language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if (lang === 'en') document.getElementById('langEnBtn')?.classList.add('active');
    if (lang === 'hi') document.getElementById('langHiBtn')?.classList.add('active');
    if (lang === 'mr') document.getElementById('langMrBtn')?.classList.add('active');

    // Update mobile menu language button active classes
    document.querySelectorAll('.lang-btn-mobile').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'none';
      btn.style.borderColor = 'var(--border-color)';
      btn.style.color = 'var(--text-main)';
    });
    const activeMobBtn = document.querySelector(`.lang-btn-mobile.lang-btn-${lang}`);
    if (activeMobBtn) {
      activeMobBtn.classList.add('active');
      activeMobBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      activeMobBtn.style.borderColor = 'transparent';
      activeMobBtn.style.color = 'white';
    }

    // Update sidebar language button active classes
    document.querySelectorAll('.lang-btn-sidebar').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'none';
      btn.style.borderColor = 'var(--border-color)';
      btn.style.color = 'var(--text-main)';
    });
    const activeSideBtn = document.querySelector(`.lang-btn-sidebar.lang-btn-${lang}`);
    if (activeSideBtn) {
      activeSideBtn.classList.add('active');
      activeSideBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      activeSideBtn.style.borderColor = 'transparent';
      activeSideBtn.style.color = 'white';
    }

    // Advanced recursive translator to cover ALL page contents
    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s+/g, ' ').trim();
        if (!text) return;
        
        for (const key in navTranslations.en) {
          const enVal = navTranslations.en[key].replace(/\s+/g, ' ').trim();
          const hiVal = navTranslations.hi[key].replace(/\s+/g, ' ').trim();
          const mrVal = navTranslations.mr[key].replace(/\s+/g, ' ').trim();
          
          if (enVal === text || hiVal === text || mrVal === text) {
            const leadingWs = node.textContent.match(/^\s*/)[0];
            const trailingWs = node.textContent.match(/\s*$/)[0];
            node.textContent = leadingWs + dict[key] + trailingWs;
            break;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip translating elements inside the settings panel or language switcher sections itself to prevent loop issues
        if (node.id === 'settingsSidebar' || 
            node.id === 'settingsToggleBtn' || 
            node.id === 'mobileSettingsToggle' || 
            node.id === 'settingsFloatBtn' || 
            (node.classList && (node.classList.contains('mobile-menu-lang-section') || node.classList.contains('sidebar-lang-section'))) ||
            node.tagName === 'SCRIPT' || 
            node.tagName === 'STYLE') {
          return;
        }

        // Translate inputs placeholder
        if (node.placeholder) {
          const placeholderText = node.placeholder.replace(/\s+/g, ' ').trim();
          for (const key in navTranslations.en) {
            const enVal = navTranslations.en[key].replace(/\s+/g, ' ').trim();
            const hiVal = navTranslations.hi[key].replace(/\s+/g, ' ').trim();
            const mrVal = navTranslations.mr[key].replace(/\s+/g, ' ').trim();
            if (enVal === placeholderText || hiVal === placeholderText || mrVal === placeholderText) {
              node.placeholder = dict[key];
              break;
            }
          }
        }

        // Translate links containing inner icons dynamically
        if (node.tagName === 'A' && (node.closest('nav') || node.closest('.mobile-menu'))) {
          // Check if link has text content along with an icon
          const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
          if (textNodes.length > 0) {
            textNodes.forEach(textNode => {
              const text = textNode.textContent.trim();
              for (const key in navTranslations.en) {
                if (
                  navTranslations.en[key] === text ||
                  navTranslations.hi[key] === text ||
                  navTranslations.mr[key] === text
                ) {
                  textNode.textContent = (textNode.textContent.match(/^\s*/)[0]) + dict[key] + (textNode.textContent.match(/\s*$/)[0]);
                  break;
                }
              }
            });
            // Stop parsing children for this specific link element
            return;
          }
        }

        node.childNodes.forEach(child => translateNode(child));
      }
    };

    translateNode(document.body);
  };

  // Language button event bindings
  document.getElementById('langEnBtn')?.addEventListener('click', () => applyTranslations('en'));
  document.getElementById('langHiBtn')?.addEventListener('click', () => applyTranslations('hi'));
  document.getElementById('langMrBtn')?.addEventListener('click', () => applyTranslations('mr'));

  // Theme Controller
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('carelens-theme', 'dark');
      document.getElementById('themeDarkBtn')?.classList.add('active');
      document.getElementById('themeLightBtn')?.classList.remove('active');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('carelens-theme', 'light');
      document.getElementById('themeLightBtn')?.classList.add('active');
      document.getElementById('themeDarkBtn')?.classList.remove('active');
    }
  };

  // Theme button event bindings
  document.getElementById('themeLightBtn')?.addEventListener('click', () => applyTheme('light'));
  document.getElementById('themeDarkBtn')?.addEventListener('click', () => applyTheme('dark'));

  // Initial Load from localStorage
  const savedLang = localStorage.getItem('carelens-lang') || 'en';
  const savedTheme = localStorage.getItem('carelens-theme') || 'light';
  
  applyTranslations(savedLang);
  applyTheme(savedTheme);
});
