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
      "Home": "Home",
      "Dashboard": "Dashboard",
      "Detection": "Detection",
      "Reports": "Reports",
      "Reminders": "Reminders",
      "History": "History",
      "Nearby": "Nearby",
      "SOS": "SOS",
      "Login": "Login",
      "Get Started": "Get Started",
      "System Settings": "System Settings",
      "Select Language": "Select Language",
      "Select Theme": "Select Theme",
      "Light": "Light",
      "Dark": "Dark",
      "Choose Language / भाषा निवडा": "Choose Language / भाषा निवडा",
      "Choose Language": "Choose Language",
      "Language / भाषा": "Language / भाषा",
      "Theme / थीम": "Theme / थीम",
      "Theme": "Theme",
      "CareLens Auth": "CareLens Auth",
      "CareLens AI • Login": "CareLens AI • Login",
      "CareLens AI • Register": "CareLens AI • Register",
      "Sign in to continue your care journey.": "Sign in to continue your care journey.",
      "Sign in to access disease detection, medication reminders, report intelligence, and your patient history—designed for comfort and clarity.": "Sign in to access disease detection, medication reminders, report intelligence, and your patient history—designed for comfort and clarity.",
      "Email Address": "Email Address",
      "Email": "Email",
      "Password": "Password",
      "Remember me": "Remember me",
      "Forgot password?": "Forgot password?",
      "Sign In": "Sign In",
      "Sign in": "Sign in",
      "New here?": "New here?",
      "Create Account": "Create Account",
      "Create account": "Create account",
      "Create your CareLens account to unlock disease detection guidance, report intelligence, emergency support, and medication reminders.": "Create your CareLens account to unlock disease detection guidance, report intelligence, emergency support, and medication reminders.",
      "Full Name": "Full Name",
      "Full name": "Full name",
      "I agree to the privacy policy": "I agree to the privacy policy",
      "Signup": "Signup",
      "Already have an account?": "Already have an account?",
      "Welcome back": "Welcome back",
      "Join calm, safe, AI-powered care": "Join calm, safe, AI-powered care",
      "or sign up with": "or sign up with",
      "or continue with": "or continue with",
      "AI-Powered Preventive Healthcare Platform": "AI-Powered Preventive Healthcare Platform",
      "✨ AI Healthcare Reimagined": "✨ AI Healthcare Reimagined",
      "Detect Early.": "Detect Early.",
      "Prevent Smarter.": "Prevent Smarter.",
      "Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.": "Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.",
      "Start Your Smart Health Journey": "Start Your Smart Health Journey",
      "Smart Healthcare Features": "Smart Healthcare Features",
      "Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.": "Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.",
      "AI disease detection toolkit": "AI disease detection toolkit",
      "Smart webcam-based healthcare analysis and fatigue monitoring.": "Smart webcam-based healthcare analysis and fatigue monitoring.",
      "Never miss a dose — CareLens sends prioritized reminders, acknowledgement tracking, and health tips.": "Never miss a dose — CareLens sends prioritized reminders, acknowledgement tracking, and health tips.",
      "Trusted By Modern Clinics": "Trusted By Modern Clinics",
      "Healthcare professionals trust CareLens AI for smarter preventive healthcare.": "Healthcare professionals trust CareLens AI for smarter preventive healthcare.",
      "“The UI feels premium and the AI recommendations are excellent.”": "“The UI feels premium and the AI recommendations are excellent.”",
      "“CareLens helped our patients stay proactive about their health.”": "“CareLens helped our patients stay proactive about their health.”",
      "“The emergency and reminder system improves patient engagement.”": "“The emergency and reminder system improves patient engagement.”",
      "Start your premium healthcare journey.": "Start your premium healthcare journey.",
      "AI-powered healthcare assistance designed for modern preventive care.": "AI-powered healthcare assistance designed for modern preventive care.",
      "Your calm AI health companion": "Your calm AI health companion",
      "Your AI healthcare companion": "Your AI healthcare companion",
      "Today’s health summary": "Today’s health summary",
      "Welcome back, Amara": "Welcome back, Amara",
      "Export report": "Export report",
      "Overall health score": "Overall health score",
      "Stress level": "Stress level",
      "Recovery index": "Recovery index",
      "Stable performance": "Stable performance",
      "Mindfulness active": "Mindfulness active",
      "Improving daily": "Improving daily",
      "Health Overview": "Health Overview",
      "AI-driven summary of your current physical indicators.": "AI-driven summary of your current physical indicators.",
      "Physical indicators": "Physical indicators",
      "Hydration": "Hydration",
      "Sleep": "Sleep",
      "Active": "Active",
      "Needs review": "Needs review",
      "Optimal": "Optimal",
      "Recent health activity": "Recent health activity",
      "Explore Dashboard": "Explore Dashboard",
      "Patient profile": "Patient profile",
      "Overview": "Overview",
      "Insights": "Insights",
      "Activity": "Activity",
      "Early fatigue detected": "Early fatigue detected",
      "Potential fatigue risk": "Potential fatigue risk",
      "Daily hydration": "Daily hydration",
      "Recommended +500ml": "Recommended +500ml",
      "Sleep analytics": "Sleep analytics",
      "Wellness momentum": "Wellness momentum",
      "Heart Rate": "Heart Rate",
      "Blood Pressure": "Blood Pressure",
      "Active Minutes": "Active Minutes",
      "Low risk detected": "Low risk detected",
      "Stable": "Stable",
      "CareLens Detection": "CareLens Detection",
      "CareLens Detection • AI-assisted health triage.": "CareLens Detection • AI-assisted health triage.",
      "AI Diagnostic Terminal": "AI Diagnostic Terminal",
      "Severity meter": "Severity meter",
      "Low risk": "Low risk",
      "Camera-assisted detection": "Camera-assisted detection",
      "Live scan ready": "Live scan ready",
      "Reset": "Reset",
      "Analyze now": "Analyze now",
      "Clinical Conversation": "Clinical Conversation",
      "Send Symptoms": "Send Symptoms",
      "Chest pain": "Chest pain",
      "Fever": "Fever",
      "Cough": "Cough",
      "Fatigue": "Fatigue",
      "Headache": "Headache",
      "Shortness": "Shortness",
      "Chat & API Console": "Chat & API Console",
      "OCR Pipeline Logger": "OCR Pipeline Logger",
      "CareLens AI • Reports": "CareLens AI • Reports",
      "Report Analysis Terminal": "Report Analysis Terminal",
      "AI Report Intelligence": "AI Report Intelligence",
      "Upload medical report": "Upload medical report",
      "Supports JPG, PNG, PDF and health record formats.": "Supports JPG, PNG, PDF and health record formats.",
      "Upload Report": "Upload Report",
      "Extracted text": "Extracted text",
      "No extracted content yet.": "No extracted content yet.",
      "Clinical Report Chat": "Clinical Report Chat",
      "Live Developer Mode • Multipart Form Upload Pipeline": "Live Developer Mode • Multipart Form Upload Pipeline",
      "Drop files here or click to select reports": "Drop files here or click to select reports",
      "Cardiac": "Cardiac",
      "Endocrine": "Endocrine",
      "Respiratory": "Respiratory",
      "Dermatology": "Dermatology",
      "AI report center": "AI report center",
      "Drag & drop upload": "Drag & drop upload",
      "OCR scan preview": "OCR scan preview",
      "AI report analysis": "AI report analysis",
      "Report categories": "Report categories",
      "CareLens Medication Planner • Keep your schedule seamless.": "CareLens Medication Planner • Keep your schedule seamless.",
      "Medication reminders": "Medication reminders",
      "Stay consistent with your daily dose. Check off when taken.": "Stay consistent with your daily dose. Check off when taken.",
      "Current schedule": "Current schedule",
      "Add new medication": "Add new medication",
      "Medication Name": "Medication Name",
      "Dosage (e.g. 1 pill, 5ml)": "Dosage (e.g. 1 pill, 5ml)",
      "Timing (e.g. 08:00 AM)": "Timing (e.g. 08:00 AM)",
      "Frequency": "Frequency",
      "Everyday": "Everyday",
      "Twice a day": "Twice a day",
      "Add Reminder": "Add Reminder",
      "Today’s medicine plan": "Today’s medicine plan",
      "Daily": "Daily",
      "Pending": "Pending",
      "Done": "Done",
      "Timeline": "Timeline",
      "Daily schedule": "Daily schedule",
      "Schedule a new prescription schedule": "Schedule a new prescription schedule",
      "Save Reminder": "Save Reminder",
      "Cancel": "Cancel",
      "Morning dose + hydration reminder.": "Morning dose + hydration reminder.",
      "Evening supplement check.": "Evening supplement check.",
      "dose check scheduled.": "dose check scheduled.",
      "CareLens Emergency • Designed for urgent health response.": "CareLens Emergency • Designed for urgent health response.",
      "SOS Emergency Mode": "SOS Emergency Mode",
      "Tap SOS to alert nearby clinics and emergency contacts instantly.": "Tap SOS to alert nearby clinics and emergency contacts instantly.",
      "SOS Activated": "SOS Activated",
      "Simulating dispatch...": "Simulating dispatch...",
      "Hospital": "Hospital",
      "Distance": "Distance",
      "Status": "Status",
      "Contact": "Contact",
      "Emergency response": "Emergency response",
      "Immediate care in one tap": "Immediate care in one tap",
      "Emergency contacts": "Emergency contacts",
      "Family Contact": "Family Contact",
      "Primary Physician": "Primary Physician",
      "Emergency Services": "Emergency Services",
      "• Ambulance ETA:": "• Ambulance ETA:",
      "• Emergency Services": "• Emergency Services",
      "• Family Contact": "• Family Contact",
      "• Primary Physician": "• Primary Physician",
      "Emergency readiness active": "Emergency readiness active",
      "Nearest hospital:": "Nearest hospital:",
      "Starlight Hospital": "Starlight Hospital",
      "Medical History Logs": "Medical History Logs",
      "Track your past symptoms, AI scans, and clinical outcomes over time.": "Track your past symptoms, AI scans, and clinical outcomes over time.",
      "Search logs...": "Search logs...",
      "Date": "Date",
      "Symptom": "Symptom",
      "Risk Level": "Risk Level",
      "Outcome": "Outcome",
      "Patient Care History": "Patient Care History",
      "Review medical milestones, prescription details, and downloadable records curated for your health journey.": "Review medical milestones, prescription details, and downloadable records curated for your health journey.",
      "Comprehensive logs": "Comprehensive logs",
      "CareLens Nearby • Precision local healthcare guidance.": "CareLens Nearby • Precision local healthcare guidance.",
      "Nearby Healthcare Facilities": "Nearby Healthcare Facilities",
      "Find hospitals, pharmacies, and specialty clinics near you.": "Find hospitals, pharmacies, and specialty clinics near you.",
      "Find medical centers, specialized clinics, and pharmacies near you with ratings, distances, and contact details.": "Find medical centers, specialized clinics, and pharmacies near you with ratings, distances, and contact details.",
      "First Aid Pharmacy": "First Aid Pharmacy",
      "Glow Pharmacy": "Glow Pharmacy",
      "Pulse Care Center": "Pulse Care Center",
      "Oasis Clinic": "Oasis Clinic",
      "CarePoint Clinic": "CarePoint Clinic",
      "Distance 1.1 km • Medicine delivery": "Distance 1.1 km • Medicine delivery",
      "Distance 1.2 km • ★★★★★": "Distance 1.2 km • ★★★★★",
      "Distance 1.8 km • Open 24/7": "Distance 1.8 km • Open 24/7",
      "Distance 1.8 km • ★★★★★": "Distance 1.8 km • ★★★★★",
      "Distance 2.4 km • Ambulance available": "Distance 2.4 km • Ambulance available",
      "Distance 2.7 km • ★★★★☆": "Distance 2.7 km • ★★★★☆",
      "Distance quick view": "Distance quick view",
      "Nearby Care Locations": "Nearby Care Locations",
      "Map overview": "Map overview",
      "Top rated facilities": "Top rated facilities",
      "Amara, I've logged these symptoms in your history. Based on the high score (urgent clinical indicator), I highly recommend scheduling a consultation or accessing SOS services on the Emergency page.": "Amara, I've logged these symptoms in your history. Based on the high score (urgent clinical indicator), I highly recommend scheduling a consultation or accessing SOS services on the Emergency page.",
      "Amara, I've noted a moderate fatigue indicator. I have updated your dashboard guidelines. Hydration tracking is advised.": "Amara, I've noted a moderate fatigue indicator. I have updated your dashboard guidelines. Hydration tracking is advised.",
      "Amara, everything looks stable. I'll check back in at your next reminder window.": "Amara, everything looks stable. I'll check back in at your next reminder window.",
      "I've noted your input. Based on your symptoms profile, please monitor for any escalation in fever or chest tightness. Let me know if you would like me to explain any particular metrics.": "I've noted your input. Based on your symptoms profile, please monitor for any escalation in fever or chest tightness. Let me know if you would like me to explain any particular metrics.",
      "Chest tightness/pain is a high priority indicator. If it is accompanied by pressure, spreading pain, or shortness of breath, please access our Emergency/SOS dashboard or call medical services immediately.": "Chest tightness/pain is a high priority indicator. If it is accompanied by pressure, spreading pain, or shortness of breath, please access our Emergency/SOS dashboard or call medical services immediately.",
      "For fever symptoms, monitor your temperature hourly. Keep hydrated (aim for 2-3 liters of water/electrolytes daily) and consider resting in a well-ventilated room.": "For fever symptoms, monitor your temperature hourly. Keep hydrated (aim for 2-3 liters of water/electrolytes daily) and consider resting in a well-ventilated room.",
      "You can ask me questions about your active symptoms, how to manage them, or request a summary of the clinical recommendations provided in the AI Analysis panel.": "You can ask me questions about your active symptoms, how to manage them, or request a summary of the clinical recommendations provided in the AI Analysis panel.",
      "You're welcome! CareLens is here to assist. Let me know if there's anything else you'd like to check.": "You're welcome! CareLens is here to assist. Let me know if there's anything else you'd like to check.",
      "I can analyze your blood pressure or general report markers. Please upload a report to let me parse the values first, or ask general questions.": "I can analyze your blood pressure or general report markers. Please upload a report to let me parse the values first, or ask general questions.",
      "The extracted blood pressure is 118/76 mmHg. A systolic pressure below 120 and diastolic below 80 is clinically classified as Normal. This indicates excellent cardiovascular efficiency.": "The extracted blood pressure is 118/76 mmHg. A systolic pressure below 120 and diastolic below 80 is clinically classified as Normal. This indicates excellent cardiovascular efficiency.",
      "Your resting heart rate is extracted as 72 bpm. For adults, a normal resting heart rate ranges from 60 to 100 beats per minute. 72 bpm is optimal.": "Your resting heart rate is extracted as 72 bpm. For adults, a normal resting heart rate ranges from 60 to 100 beats per minute. 72 bpm is optimal.",
      "No elevated indicators or pathological flags (such as high cholesterol, high glucose, or abnormal liver enzymes) were identified in the scanned region.": "No elevated indicators or pathological flags (such as high cholesterol, high glucose, or abnormal liver enzymes) were identified in the scanned region.",
      "Ask me to clarify clinical abbreviations or explain particular biometrics like blood pressure or heart rate from your uploaded document.": "Ask me to clarify clinical abbreviations or explain particular biometrics like blood pressure or heart rate from your uploaded document.",
      "Glad to help! Let me know if you have other markers you want to interpret.": "Glad to help! Let me know if you have other markers you want to interpret.",
      "I'm analyzing your health profile. Everything seems consistent with healthy recovery.": "I'm analyzing your health profile. Everything seems consistent with healthy recovery.",
      "Based on standard medical telemetry, keeping active hydration is highly recommended today.": "Based on standard medical telemetry, keeping active hydration is highly recommended today.",
      "I've flagged your report for review. Your stress indices indicate mindfulness could help.": "I've flagged your report for review. Your stress indices indicate mindfulness could help.",
      "Would you like me to add a reminder to help organize your schedule?": "Would you like me to add a reminder to help organize your schedule?",
      "Your fatigue telemetry looks normal, but let me know if you experience headaches.": "Your fatigue telemetry looks normal, but let me know if you experience headaches.",
      "Hello! Need help setting up your profile or primary healthcare goals?": "Hello! Need help setting up your profile or primary healthcare goals?",
      "Hi 👋 I can help you with disease detection, medication reminders, or reports parsing.": "Hi 👋 I can help you with disease detection, medication reminders, or reports parsing.",
      "Hello 👋 How can I help you today?": "Hello 👋 How can I help you today?",
      "Hi, I'm the CareLens OCR report parser. Upload medical documents on the main screen to automatically parse biometric indicators. You can ask me questions about your reports here.": "Hi, I'm the CareLens OCR report parser. Upload medical documents on the main screen to automatically parse biometric indicators. You can ask me questions about your reports here.",
      "I can help with: disease detection, reminders, emergency support, and health awareness.": "I can help with: disease detection, reminders, emergency support, and health awareness.",
      "I can guide you step-by-step.": "I can guide you step-by-step.",
      "Tip: Enter comma-separated symptoms or short phrases for best scan clarity.": "Tip: Enter comma-separated symptoms or short phrases for best scan clarity."
  },
    hi: {
      "Home": "मुख्य पृष्ठ",
      "Dashboard": "डैशबोर्ड",
      "Detection": "बीमारी जांच",
      "Reports": "रिपोर्ट्स",
      "Reminders": "दवा याद दिलाएं",
      "History": "इतिहास",
      "Nearby": "पास के अस्पताल",
      "SOS": "आपातकालीन SOS",
      "Login": "लॉगिन",
      "Get Started": "शुरू करें",
      "System Settings": "सिस्टम सेटिंग्स",
      "Select Language": "भाषा चुनें",
      "Select Theme": "थीम चुनें",
      "Light": "लाइट",
      "Dark": "डार्क",
      "Choose Language / भाषा निवडा": "भाषा चुनें",
      "Choose Language": "भाषा चुनें",
      "Language / भाषा": "भाषा",
      "Theme / थीम": "थीम",
      "Theme": "थीम",
      "CareLens Auth": "केयरलेंस प्रमाणीकरण",
      "CareLens AI • Login": "केयरलेंस एआई • लॉगिन",
      "CareLens AI • Register": "केयरलेंस एआई • पंजीकरण",
      "Sign in to continue your care journey.": "अपनी देखभाल यात्रा जारी रखने के लिए साइन इन करें।",
      "Sign in to access disease detection, medication reminders, report intelligence, and your patient history—designed for comfort and clarity.": "आराम और स्पष्टता के लिए डिज़ाइन की गई बीमारी का पता लगाने, दवा अनुस्मारक, रिपोर्ट इंटेलिजेंस और अपने रोगी इतिहास तक पहुँचने के लिए साइन इन करें।",
      "Email Address": "ईमेल पता",
      "Email": "ईमेल",
      "Password": "पासवर्ड",
      "Remember me": "मुझे याद रखें",
      "Forgot password?": "पासवर्ड भूल गए?",
      "Sign In": "साइन इन करें",
      "Sign in": "साइन इन करें",
      "New here?": "यहाँ नए हैं?",
      "Create Account": "खाता बनाएं",
      "Create account": "खाता बनाएं",
      "Create your CareLens account to unlock disease detection guidance, report intelligence, emergency support, and medication reminders.": "रोग पहचान मार्गदर्शन, रिपोर्ट इंटेलिजेंस, आपातकालीन सहायता और दवा अनुस्मारक अनलॉक करने के लिए अपना केयरलेंस खाता बनाएं।",
      "Full Name": "पूरा नाम",
      "Full name": "पूरा नाम",
      "I agree to the privacy policy": "मैं गोपनीयता नीति से सहमत हूँ",
      "Signup": "साइनअप",
      "Already have an account?": "पहले से ही एक खाता है?",
      "Welcome back": "आपका स्वागत है",
      "Join calm, safe, AI-powered care": "शांत, सुरक्षित, एआई-संचालित देखभाल में शामिल हों",
      "or sign up with": "या इसके साथ साइन अप करें",
      "or continue with": "या इसके साथ जारी रखें",
      "AI-Powered Preventive Healthcare Platform": "एआई-संचालित निवारक स्वास्थ्य सेवा मंच",
      "✨ AI Healthcare Reimagined": "✨ एआई स्वास्थ्य सेवा नए रूप में",
      "Detect Early.": "जल्दी पता लगाएं।",
      "Prevent Smarter.": "होशियारी से बचाव करें।",
      "Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.": "लक्षण लिखें, लक्षण चिप्स पर टैप करें, और केयरलेंस एआई को सेकंडों में जोखिम, गंभीरता और उपचार तत्परता का विश्लेषण करने दें।",
      "Start Your Smart Health Journey": "अपनी स्मार्ट स्वास्थ्य यात्रा शुरू करें",
      "Smart Healthcare Features": "स्मार्ट हेल्थकेयर विशेषताएं",
      "Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.": "शुरुआती बीमारी का पता लगाने, आपातकालीन सहायता और कल्याण निगरानी के लिए उन्नत एआई-संचालित स्वास्थ्य सेवा उपकरण।",
      "AI disease detection toolkit": "एआई बीमारी जांच टूलकिट",
      "Smart webcam-based healthcare analysis and fatigue monitoring.": "स्मार्ट वेबकैम-आधारित स्वास्थ्य विश्लेषण और थकान निगरानी।",
      "Never miss a dose — CareLens sends prioritized reminders, acknowledgement tracking, and health tips.": "कभी भी खुराक न चूकें — केयरलेंस प्राथमिकता अनुस्मारक, पावती ट्रैकिंग और स्वास्थ्य युक्तियाँ भेजता है।",
      "Trusted By Modern Clinics": "आधुनिक क्लीनिकों द्वारा विश्वसनीय",
      "Healthcare professionals trust CareLens AI for smarter preventive healthcare.": "समानतापूर्ण निवारक स्वास्थ्य सेवा के लिए स्वास्थ्य देखभाल पेशेवर केयरलेंस एआई पर भरोसा करते हैं।",
      "“The UI feels premium and the AI recommendations are excellent.”": "“यूआई प्रीमियम लगता है और एआई सिफारिशें उत्कृष्ट हैं।”",
      "“CareLens helped our patients stay proactive about their health.”": "“केयरलेंस ने हमारे मरीजों को उनके स्वास्थ्य के प्रति सक्रिय रहने में मदद की।”",
      "“The emergency and reminder system improves patient engagement.”": "“आपातकालीन और अनुस्मारक प्रणाली रोगी जुड़ाव में सुधार करती है।”",
      "Start your premium healthcare journey.": "अपनी प्रीमियम स्वास्थ्य सेवा यात्रा शुरू करें।",
      "AI-powered healthcare assistance designed for modern preventive care.": "आधुनिक निवारक देखभाल के लिए डिज़ाइन की गई एआई-संचालित स्वास्थ्य सहायता।",
      "Your calm AI health companion": "आपका शांत एआई स्वास्थ्य साथी",
      "Your AI healthcare companion": "आपका एआई स्वास्थ्य साथी",
      "Today’s health summary": "आज का स्वास्थ्य सारांश",
      "Welcome back, Amara": "स्वागत है, अमारा",
      "Export report": "रिपोर्ट निर्यात करें",
      "Overall health score": "समग्र स्वास्थ्य स्कोर",
      "Stress level": "तनाव का स्तर",
      "Recovery index": "पुनर्प्राप्ति सूचकांक",
      "Stable performance": "स्थिर प्रदर्शन",
      "Mindfulness active": "सजगत सक्रिय",
      "Improving daily": "रोज सुधार हो रहा है",
      "Health Overview": "स्वास्थ्य सिंहावलोकन",
      "AI-driven summary of your current physical indicators.": "आपके वर्तमान शारीरिक संकेतकों का एआई-संचालित सारांश।",
      "Physical indicators": "शारीरिक संकेतक",
      "Hydration": "जलीकरण",
      "Sleep": "नींद",
      "Active": "सक्रिय",
      "Needs review": "समीक्षा की आवश्यकता है",
      "Optimal": "इष्टतम",
      "Recent health activity": "हाल की स्वास्थ्य गतिविधि",
      "Explore Dashboard": "डैशबोर्ड खोजें",
      "Patient profile": "रोगी प्रोफ़ाइल",
      "Overview": "अवलोकन",
      "Insights": "अंतर्दृष्टि",
      "Activity": "गतिविधि",
      "Early fatigue detected": "शुरुआती थकान का पता चला",
      "Potential fatigue risk": "संभावित थकान जोखिम",
      "Daily hydration": "दैनिक जलीकरण",
      "Recommended +500ml": "अनुशंसित +500 मिली",
      "Sleep analytics": "नींद विश्लेषण",
      "Wellness momentum": "कल्याण गति",
      "Heart Rate": "हृदय गति",
      "Blood Pressure": "रक्तचाप",
      "Active Minutes": "सक्रिय मिनट",
      "Low risk detected": "कम जोखिम का पता चला",
      "Stable": "स्थिर",
      "CareLens Detection": "केयरलेंस बीमारी जांच",
      "CareLens Detection • AI-assisted health triage.": "केयरलेंस बीमारी जांच • एआई-सहायता प्राप्त स्वास्थ्य जांच।",
      "AI Diagnostic Terminal": "एआई डायग्नोस्टिक टर्मिनल",
      "Severity meter": "गंभीरता मीटर",
      "Low risk": "कम जोखिम",
      "Camera-assisted detection": "कैमरा-सहायता प्राप्त जांच",
      "Live scan ready": "लाइव स्कैन तैयार",
      "Reset": "रीसेट",
      "Analyze now": "अभी विश्लेषण करें",
      "Clinical Conversation": "नैदानिक बातचीत",
      "Send Symptoms": "लक्षण भेजें",
      "Chest pain": "छाती में दर्द",
      "Fever": "बुखार",
      "Cough": "खांसी",
      "Fatigue": "थकान",
      "Headache": "सिरदर्द",
      "Shortness": "साँस की कमी",
      "Chat & API Console": "चैट और एपीआई कंसोल",
      "OCR Pipeline Logger": "ओसीआर पाइपलाइन लॉगर",
      "CareLens AI • Reports": "केयरलेंस एआई • रिपोर्ट्स",
      "Report Analysis Terminal": "रिपोर्ट विश्लेषण टर्मिनल",
      "AI Report Intelligence": "एआई रिपोर्ट इंटेलिजेंस",
      "Upload medical report": "मेडिकल रिपोर्ट अपलोड करें",
      "Supports JPG, PNG, PDF and health record formats.": "जेपीजी, पीएनजी, पीडीएफ और स्वास्थ्य रिकॉर्ड प्रारूपों का समर्थन करता है।",
      "Upload Report": "रिपोर्ट अपलोड करें",
      "Extracted text": "निकाला गया पाठ",
      "No extracted content yet.": "अभी तक कोई निकाली गई सामग्री नहीं है।",
      "Clinical Report Chat": "नैदानिक रिपोर्ट चैट",
      "Live Developer Mode • Multipart Form Upload Pipeline": "लाइव डेवलपर मोड • मल्टीपार्ट फॉर्म अपलोड पाइपलाइन",
      "Drop files here or click to select reports": "फ़ाइलें यहाँ छोड़ें या रिपोर्ट चुनने के लिए क्लिक करें",
      "Cardiac": "हृदय रोग",
      "Endocrine": "अंतःस्रावी",
      "Respiratory": "श्वसन",
      "Dermatology": "त्वचा विज्ञान",
      "AI report center": "एआई रिपोर्ट केंद्र",
      "Drag & drop upload": "ड्रैग और ड्रॉप अपलोड",
      "OCR scan preview": "ओसीआर स्कैन पूर्वावलोकन",
      "AI report analysis": "एआई रिपोर्ट विश्लेषण",
      "Report categories": "रिपोर्ट श्रेणियां",
      "CareLens Medication Planner • Keep your schedule seamless.": "केयरलेंस दवा योजनाकार • अपने कार्यक्रम को निर्बाध रखें।",
      "Medication reminders": "दवा अनुस्मारक",
      "Stay consistent with your daily dose. Check off when taken.": "अपनी दैनिक खुराक के साथ सुसंगत रहें। दवा लेने पर टिक करें।",
      "Current schedule": "वर्तमान अनुसूची",
      "Add new medication": "नई दवा जोड़ें",
      "Medication Name": "दवा का नाम",
      "Dosage (e.g. 1 pill, 5ml)": "खुराक (जैसे 1 गोली, 5 मिली)",
      "Timing (e.g. 08:00 AM)": "समय (जैसे 08:00 AM)",
      "Frequency": "आवृत्ति",
      "Everyday": "हर दिन",
      "Twice a day": "दिन में दो बार",
      "Add Reminder": "अनुस्मारक जोड़ें",
      "Today’s medicine plan": "आज की दवा योजना",
      "Daily": "दैनिक",
      "Pending": "लंबित",
      "Done": "पूर्ण",
      "Timeline": "समयरेखा",
      "Daily schedule": "दैनिक कार्यक्रम",
      "Schedule a new prescription schedule": "एक नया नुस्खा कार्यक्रम शेड्यूल करें",
      "Save Reminder": "अनुस्मारक सहेजें",
      "Cancel": "रद्द करें",
      "Morning dose + hydration reminder.": "सुबह की खुराक + जलीकरण अनुस्मारक।",
      "Evening supplement check.": "शाम पूरक जांच।",
      "dose check scheduled.": "खुराक जांच अनुसूचित।",
      "CareLens Emergency • Designed for urgent health response.": "केयरलेंस आपातकालीन • तत्काल स्वास्थ्य प्रतिक्रिया के लिए डिज़ाइन किया गया।",
      "SOS Emergency Mode": "एसओएस आपातकालीन मोड",
      "Tap SOS to alert nearby clinics and emergency contacts instantly.": "पास के क्लीनिकों और आपातकालीन संपर्कों को तुरंत सचेत करने के लिए एसओएस टैप करें।",
      "SOS Activated": "एसओएस सक्रिय",
      "Simulating dispatch...": "प्रेषण का अनुकरण किया जा रहा है...",
      "Hospital": "अस्पताल",
      "Distance": "दूरी",
      "Status": "स्थिति",
      "Contact": "संपर्क",
      "Emergency response": "आपातकालीन प्रतिक्रिया",
      "Immediate care in one tap": "एक टैप में तत्काल देखभाल",
      "Emergency contacts": "आपातकालीन संपर्क",
      "Family Contact": "पारिवारिक संपर्क",
      "Primary Physician": "प्राथमिक चिकित्सक",
      "Emergency Services": "आपातकालीन सेवाएं",
      "• Ambulance ETA:": "• एम्बुलेंस आगमन समय:",
      "• Emergency Services": "• आपातकालीन सेवाएं",
      "• Family Contact": "• पारिवारिक संपर्क",
      "• Primary Physician": "• प्राथमिक चिकित्सक",
      "Emergency readiness active": "आपातकालीन तत्परता सक्रिय",
      "Nearest hospital:": "निकटतम अस्पताल:",
      "Starlight Hospital": "स्टारलाइट अस्पताल",
      "Medical History Logs": "चिकित्सा इतिहास लॉग",
      "Track your past symptoms, AI scans, and clinical outcomes over time.": "समय के साथ अपने पिछले लक्षणों, एआई स्कैन और नैदानिक परिणामों को ट्रैक करें।",
      "Search logs...": "लॉग खोजें...",
      "Date": "तारीख",
      "Symptom": "लक्षण",
      "Risk Level": "जोखिम का स्तर",
      "Outcome": "परिणाम",
      "Patient Care History": "रोगी देखभाल इतिहास",
      "Review medical milestones, prescription details, and downloadable records curated for your health journey.": "अपनी स्वास्थ्य यात्रा के लिए तैयार किए गए चिकित्सा मील के पत्थर, नुस्खे के विवरण और डाउनलोड करने योग्य रिकॉर्ड की समीक्षा करें।",
      "Comprehensive logs": "व्यापक लॉग",
      "CareLens Nearby • Precision local healthcare guidance.": "केयरलेंस पास के स्थान • सटीक स्थानीय स्वास्थ्य मार्गदर्शन।",
      "Nearby Healthcare Facilities": "पास की स्वास्थ्य सुविधाएं",
      "Find hospitals, pharmacies, and specialty clinics near you.": "अपने आस-पास के अस्पतालों, फार्मेसियों और विशेष क्लीनिकों को खोजें।",
      "Find medical centers, specialized clinics, and pharmacies near you with ratings, distances, and contact details.": "रेटिंग, दूरी और संपर्क विवरण के साथ अपने पास के चिकित्सा केंद्रों, विशेष क्लीनिकों और फार्मेसियों को खोजें।",
      "First Aid Pharmacy": "फर्स्ट एड फार्मेसी",
      "Glow Pharmacy": "ग्लो फार्मेसी",
      "Pulse Care Center": "पल्स केयर सेंटर",
      "Oasis Clinic": "ओएसिस क्लिनिक",
      "CarePoint Clinic": "केयरपॉइंट क्लिनिक",
      "Distance 1.1 km • Medicine delivery": "दूरी 1.1 किमी • दवा वितरण",
      "Distance 1.2 km • ★★★★★": "दूरी 1.2 किमी • ★★★★★",
      "Distance 1.8 km • Open 24/7": "दूरी 1.8 किमी • 24/7 खुला",
      "Distance 1.8 km • ★★★★★": "दूरी 1.8 किमी • ★★★★★",
      "Distance 2.4 km • Ambulance available": "दूरी 2.4 किमी • एम्बुलेंस उपलब्ध",
      "Distance 2.7 km • ★★★★☆": "दूरी 2.7 किमी • ★★★★☆",
      "Distance quick view": "दूरी त्वरित दृश्य",
      "Nearby Care Locations": "पास के स्वास्थ्य सेवा केंद्र",
      "Map overview": "मानचित्र अवलोकन",
      "Top rated facilities": "शीर्ष रेटेड सुविधाएं",
      "Amara, I've logged these symptoms in your history. Based on the high score (urgent clinical indicator), I highly recommend scheduling a consultation or accessing SOS services on the Emergency page.": "अमारा, मैंने इन लक्षणों को आपके इतिहास में दर्ज कर लिया है। उच्च स्कोर (तत्काल नैदानिक सूचक) के आधार पर, मैं एक परामर्श शेड्यूल करने या आपातकालीन पृष्ठ पर एसओएस सेवाओं तक पहुंचने की अत्यधिक अनुशंसा करता हूँ।",
      "Amara, I've noted a moderate fatigue indicator. I have updated your dashboard guidelines. Hydration tracking is advised.": "अमारा, मैंने एक मध्यम थकान सूचक दर्ज किया है। मैंने आपके डैशबोर्ड दिशानिर्देशों को अपडेट कर दिया है। जलीकरण ट्रैकिंग की सलाह दी जाती है।",
      "Amara, everything looks stable. I'll check back in at your next reminder window.": "अमारा, सब कुछ स्थिर लग रहा है। मैं आपकी अगली अनुस्मारक खिड़की पर वापस जाँच करूँगा।",
      "I've noted your input. Based on your symptoms profile, please monitor for any escalation in fever or chest tightness. Let me know if you would like me to explain any particular metrics.": "मैंने आपके इनपुट को नोट कर लिया है। आपके लक्षणों के आधार पर, कृपया बुखार या छाती में जकड़न में किसी भी वृद्धि की निगरानी करें। मुझे बताएं कि क्या आप चाहते हैं कि मैं किसी विशेष मीट्रिक को स्पष्ट करूं।",
      "Chest tightness/pain is a high priority indicator. If it is accompanied by pressure, spreading pain, or shortness of breath, please access our Emergency/SOS dashboard or call medical services immediately.": "छाती में जकड़न/दर्द एक उच्च प्राथमिकता वाला संकेतक है। यदि इसके साथ दबाव, फैलने वाला दर्द या सांस लेने में तकलीफ होती है, तो कृपया तुरंत हमारे आपातकालीन/एसओएस डैशबोर्ड तक पहुंचें या चिकित्सा सेवाओं को कॉल करें।",
      "For fever symptoms, monitor your temperature hourly. Keep hydrated (aim for 2-3 liters of water/electrolytes daily) and consider resting in a well-ventilated room.": "बुखार के लक्षणों के लिए, हर घंटे अपने तापमान की निगरानी करें। हाइड्रेटेड रहें (रोजाना 2-3 लीटर पानी/इलेक्ट्रोलाइट्स का लक्ष्य रखें) और एक अच्छी तरह हवादार कमरे में आराम करने पर विचार करें।",
      "You can ask me questions about your active symptoms, how to manage them, or request a summary of the clinical recommendations provided in the AI Analysis panel.": "आप मुझसे अपने सक्रिय लक्षणों, उन्हें प्रबंधित करने के तरीके के बारे में प्रश्न पूछ सकते हैं, या एआई विश्लेषण पैनल में प्रदान की गई नैदानिक सिफारिशों के सारांश का अनुरोध कर सकते हैं।",
      "You're welcome! CareLens is here to assist. Let me know if there's anything else you'd like to check.": "आपका स्वागत है! केयरलेंस सहायता के लिए यहाँ है। मुझे बताएं कि क्या आप कुछ और जांचना चाहते हैं।",
      "I can analyze your blood pressure or general report markers. Please upload a report to let me parse the values first, or ask general questions.": "मैं आपके रक्तचाप या सामान्य रिपोर्ट मार्करों का विश्लेषण कर सकता हूँ। कृपया मुझे पहले मानों को पार्स करने देने के लिए एक रिपोर्ट अपलोड करें, या सामान्य प्रश्न पूछें।",
      "The extracted blood pressure is 118/76 mmHg. A systolic pressure below 120 and diastolic below 80 is clinically classified as Normal. This indicates excellent cardiovascular efficiency.": "निकाला गया रक्तचाप 118/76 mmHg है। 120 से नीचे सिस्टोलिक दबाव और 80 से नीचे डायस्टोलिक को नैदानिक रूप से सामान्य के रूप में वर्गीकृत किया गया है। यह उत्कृष्ट हृदय दक्षता को दर्शाता है।",
      "Your resting heart rate is extracted as 72 bpm. For adults, a normal resting heart rate ranges from 60 to 100 beats per minute. 72 bpm is optimal.": "आपकी विश्राम हृदय गति 72 bpm निकाली गई है। वयस्कों के लिए, एक सामान्य विश्राम हृदय गति 60 से 100 धड़कन प्रति मिनट के बीच होती है। 72 bpm इष्टतम है।",
      "No elevated indicators or pathological flags (such as high cholesterol, high glucose, or abnormal liver enzymes) were identified in the scanned region.": "स्कैन किए गए क्षेत्र में कोई ऊंचे संकेतक या रोग संबंधी झंडे (जैसे उच्च कोलेस्ट्रॉल, उच्च ग्लूकोज, या असामान्य यकृत एंजाइम) की पहचान नहीं की गई।",
      "Ask me to clarify clinical abbreviations or explain particular biometrics like blood pressure or heart rate from your uploaded document.": "मुझे अपने अपलोड किए गए दस्तावेज़ से नैदानिक संक्षिप्त रूपों को स्पष्ट करने या रक्तचाप या हृदय गति जैसे विशेष बायोमेट्रिक्स को समझाने के लिए कहें।",
      "Glad to help! Let me know if you have other markers you want to interpret.": "मदद करके खुशी हुई! मुझे बताएं कि क्या आपके पास अन्य मार्कर हैं जिन्हें आप समझना चाहते हैं।",
      "I'm analyzing your health profile. Everything seems consistent with healthy recovery.": "मैं आपके स्वास्थ्य प्रोफ़ाइल का विश्लेषण कर रहा हूँ। सब कुछ स्वस्थ सुधार के अनुरूप लग रहा है।",
      "Based on standard medical telemetry, keeping active hydration is highly recommended today.": "मानक चिकित्सा टेलीमेट्री के आधार पर, आज सक्रिय जलीकरण रखने की अत्यधिक अनुशंसा की जाती है।",
      "I've flagged your report for review. Your stress indices indicate mindfulness could help.": "मैंने आपकी रिपोर्ट को समीक्षा के लिए चिह्नित किया है। आपके तनाव सूचकांक संकेत देते हैं कि सजगता मदद कर सकती है।",
      "Would you like me to add a reminder to help organize your schedule?": "क्या आप चाहेंगे कि मैं आपके कार्यक्रम को व्यवस्थित करने में मदद के लिए एक अनुस्मारक जोड़ूं?",
      "Your fatigue telemetry looks normal, but let me know if you experience headaches.": "आपकी थकान टेलीमेट्री सामान्य दिखती है, लेकिन यदि आपको सिरदर्द का अनुभव होता है तो मुझे बताएं।",
      "Hello! Need help setting up your profile or primary healthcare goals?": "नमस्ते! अपना प्रोफ़ाइल या प्राथमिक स्वास्थ्य लक्ष्य सेट करने में सहायता चाहिए?",
      "Hi 👋 I can help you with disease detection, medication reminders, or reports parsing.": "नमस्ते 👋 मैं बीमारी का पता लगाने, दवा अनुस्मारक, या रिपोर्ट विश्लेषण में आपकी सहायता कर सकता हूँ।",
      "Hello 👋 How can I help you today?": "नमस्ते 👋 आज मैं आपकी क्या सहायता कर सकता हूँ?",
      "Hi, I'm the CareLens OCR report parser. Upload medical documents on the main screen to automatically parse biometric indicators. You can ask me questions about your reports here.": "नमस्ते, मैं केयरलेंस ओसीआर रिपोर्ट पार्सर हूँ। बायोमेट्रिक संकेतकों को स्वचालित रूप से पार्स करने के लिए मुख्य स्क्रीन पर मेडिकल दस्तावेज़ अपलोड करें। आप मुझसे यहाँ अपनी रिपोर्ट के बारे में प्रश्न पूछ सकते हैं।",
      "I can help with: disease detection, reminders, emergency support, and health awareness.": "मैं बीमारी का पता लगाने, अनुस्मारक, आपातकालीन सहायता और स्वास्थ्य जागरूकता में सहायता कर सकता हूँ।",
      "I can guide you step-by-step.": "मैं आपको कदम-दर-कदम मार्गदर्शन कर सकता हूँ।",
      "Tip: Enter comma-separated symptoms or short phrases for best scan clarity.": "सुझाव: सर्वोत्तम स्कैन स्पष्टता के लिए अल्पविराम से अलग किए गए लक्षण या छोटे वाक्यांश दर्ज करें।"
  },
    mr: {
      "Home": "मुख्यपृष्ठ",
      "Dashboard": "डॅशबोर्ड",
      "Detection": "आजार शोधणे",
      "Reports": "अहवाल",
      "Reminders": "स्मरणपत्रे",
      "History": "इतिहास",
      "Nearby": "जवळचे दवाखाने",
      "SOS": "आपत्कालीन SOS",
      "Login": "लॉगिन",
      "Get Started": "सुरू करा",
      "System Settings": "सिस्टम सेटिंग्ज",
      "Select Language": "भाषा निवडा",
      "Select Theme": "थीम निवडा",
      "Light": "लाईट",
      "Dark": "डार्क",
      "Choose Language / भाषा निवडा": "भाषा निवडा",
      "Choose Language": "भाषा निवडा",
      "Language / भाषा": "भाषा",
      "Theme / थीम": "थीम",
      "Theme": "थीम",
      "CareLens Auth": "केअरलेन्स ऑथ",
      "CareLens AI • Login": "केअरलेन्स एआय • लॉगिन",
      "CareLens AI • Register": "केअरलेन्स एआय • नोंदणी",
      "Sign in to continue your care journey.": "तुमचा आरोग्य प्रवास सुरू ठेवण्यासाठी साइन इन करा.",
      "Sign in to access disease detection, medication reminders, report intelligence, and your patient history—designed for comfort and clarity.": "आजाराची तपासणी, औषध स्मरणपत्रे, अहवाल इंटेलिजन्स आणि रुग्ण इतिहास मिळवण्यासाठी साइन इन करा.",
      "Email Address": "ईमेल पत्ता",
      "Email": "ईमेल",
      "Password": "पासवर्ड",
      "Remember me": "माझी आठवण ठेवा",
      "Forgot password?": "पासवर्ड विसरलात?",
      "Sign In": "साइन इन करा",
      "Sign in": "साइन इन करा",
      "New here?": "येथे नवीन आहात?",
      "Create Account": "खाते तयार करा",
      "Create account": "खाते तयार करा",
      "Create your CareLens account to unlock disease detection guidance, report intelligence, emergency support, and medication reminders.": "आजार तपासणी मार्गदर्शन, अहवाल इंटेलिजन्स, आपत्कालीन सहाय्य आणि औषध स्मरणपत्रे अनलॉक करण्यासाठी आपले केअरलेन्स खाते तयार करा.",
      "Full Name": "पूर्ण नाव",
      "Full name": "पूर्ण नाव",
      "I agree to the privacy policy": "मी गोपनीयता धोरणाशी सहमत आहे",
      "Signup": "साइनअप",
      "Already have an account?": "आधीच खाते आहे?",
      "Welcome back": "स्वागत आहे",
      "Join calm, safe, AI-powered care": "शांत, सुरक्षित, एआय-आधारित काळजीत सामील व्हा",
      "or sign up with": "किंवा यासह साइन अप करा",
      "or continue with": "किंवा यासह सुरू ठेवा",
      "AI-Powered Preventive Healthcare Platform": "एआय-आधारित प्रतिबंधात्मक आरोग्य प्लॅटफॉर्म",
      "✨ AI Healthcare Reimagined": "✨ एआय आरोग्य सेवा नवीन रूपात",
      "Detect Early.": "लवकर शोधा.",
      "Prevent Smarter.": "अधिक हुशारीने प्रतिबंध करा.",
      "Type symptoms, tap symptom chips, and let CareLens AI analyze risk, severity, and treatment readiness in seconds.": "लक्षणे टाईप करा, लक्षण चिप्सवर टॅप करा आणि केअरलेन्स एआयला सेकंदात जोखीम, तीव्रता आणि उपचारांची तयारी यांचे विश्लेषण करू द्या.",
      "Start Your Smart Health Journey": "तुमचा स्मार्ट आरोग्य प्रवास सुरू करा",
      "Smart Healthcare Features": "स्मार्ट आरोग्य वैशिष्ट्ये",
      "Advanced AI-powered healthcare tools for early disease detection, emergency support, and wellness monitoring.": "लवकर आजार शोधणे, आपत्कालीन सहाय्य आणि कल्याण देखरेख यासाठी प्रगत एआय-आधारित आरोग्य साधने.",
      "AI disease detection toolkit": "कॅरलेन्स आजार तपासणी टूलकिट",
      "Smart webcam-based healthcare analysis and fatigue monitoring.": "वेबकॅम-आधारित स्मार्ट आरोग्य विश्लेषण आणि थकवा देखरेख.",
      "Never miss a dose — CareLens sends prioritized reminders, acknowledgement tracking, and health tips.": "डोस कधीही विसरू नका — केअरलेन्स प्राधान्य स्मरणपत्रे, पावती ट्रॅकिंग आणि आरोग्य टिप्स पाठवते.",
      "Trusted By Modern Clinics": "आधुनिक क्लिनिकद्वारे विश्वासार्ह",
      "Healthcare professionals trust CareLens AI for smarter preventive healthcare.": "स्मार्ट प्रतिबंधात्मक आरोग्यासाठी आरोग्य व्यावसायिक केअरलेन्स एआय वर विश्वास ठेवतात.",
      "“The UI feels premium and the AI recommendations are excellent.”": "“यूआय प्रीमियम वाटतो आणि एआय शिफारसी उत्कृष्ट आहेत.”",
      "“CareLens helped our patients stay proactive about their health.”": "“केअरलेन्सने आमच्या रुग्णांना त्यांच्या आरोग्याविषयी सक्रिय राहण्यास मदत केली.”",
      "“The emergency and reminder system improves patient engagement.”": "“आपत्कालीन आणि स्मरणपत्र प्रणाली रुग्णाच्या सहभागात सुधारणा करते.”",
      "Start your premium healthcare journey.": "तुमचा प्रीमियम आरोग्य प्रवास सुरू करा.",
      "AI-powered healthcare assistance designed for modern preventive care.": "आधुनिक प्रतिबंधात्मक काळजीसाठी डिझाइन केलेले एआय-आधारित आरोग्य सहाय्य.",
      "Your calm AI health companion": "तुमचा शांत एआय आरोग्य सोबती",
      "Your AI healthcare companion": "तुमचा एआय आरोग्य सोबती",
      "Today’s health summary": "आजचा आरोग्य सारांश",
      "Welcome back, Amara": "स्वागत आहे, अमारा",
      "Export report": "अहवाल निर्यात करा",
      "Overall health score": "एकूण आरोग्य स्कोअर",
      "Stress level": "ताणाची पातळी",
      "Recovery index": "रिकव्हरी इंडेक्स",
      "Stable performance": "स्थिर कामगिरी",
      "Mindfulness active": "माइंडफुलनेस सक्रिय",
      "Improving daily": "दररोज सुधारणा होत आहे",
      "Health Overview": "आरोग्य विहंगावलोकन",
      "AI-driven summary of your current physical indicators.": "तुमच्या सध्याच्या शारीरिक निर्देशकांचा एआय-आधारित सारांश.",
      "Physical indicators": "शारीरिक निर्देशक",
      "Hydration": "हायड्रेशन",
      "Sleep": "झोप",
      "Active": "सक्रिय",
      "Needs review": "पुनरावलोकन आवश्यक",
      "Optimal": "उत्कृष्ट",
      "Recent health activity": "अलीकडील आरोग्य क्रियाकलाप",
      "Explore Dashboard": "डॅशबोर्ड एक्सप्लोर करा",
      "Patient profile": "रुग्ण प्रोफाईल",
      "Overview": "विहंगावलोकन",
      "Insights": "इनसाईट",
      "Activity": "क्रियाशीलता",
      "Early fatigue detected": "लवकर थकवा आढळला",
      "Potential fatigue risk": "संभाव्य थकवा जोखीम",
      "Daily hydration": "रोजचे हायड्रेशन",
      "Recommended +500ml": "शिफारस केलेले +५०० मिली",
      "Sleep analytics": "झोप विश्लेषण",
      "Wellness momentum": "आरोग्य मोमेंटम",
      "Heart Rate": "हृदय गती",
      "Blood Pressure": "रक्तदाब",
      "Active Minutes": "सक्रिय मिनिटे",
      "Low risk detected": "कमी धोका आढळला",
      "Stable": "स्थिर",
      "CareLens Detection": "केअरलेन्स आजार तपासणी",
      "CareLens Detection • AI-assisted health triage.": "केअरलेन्स आजार तपासणी • एआय-सहाय्यित आरोग्य तपासणी.",
      "AI Diagnostic Terminal": "आय डायग्नोस्टिक टर्मिनल",
      "Severity meter": "तीव्रता मीटर",
      "Low risk": "कमी धोका",
      "Camera-assisted detection": "कॅरलेन्स कॅмера-सहाय्यित शोध",
      "Live scan ready": "लाइव्ह स्कॅन तयार",
      "Reset": "रीसेट",
      "Analyze now": "आता विश्लेषण करा",
      "Clinical Conversation": "वैद्यकीय संभाषण",
      "Send Symptoms": "लक्षणे पाठवा",
      "Chest pain": "छाती दुखणे",
      "Fever": "ताप",
      "Cough": "खोकला",
      "Fatigue": "थकवा",
      "Headache": "डोकेदुखी",
      "Shortness": "दम लागणे",
      "Chat & API Console": "चॅट आणि एपीआई कन्सोल",
      "OCR Pipeline Logger": "ओसीआर पाइपलाइन लॉगर",
      "CareLens AI • Reports": "केअरलेन्स एआय • अहवाल",
      "Report Analysis Terminal": "अहवाल विश्लेषण टर्मिनल",
      "AI Report Intelligence": "अहवाल इंटेलिजन्स",
      "Upload medical report": "वैद्यकीय अहवाल अपलोड करा",
      "Supports JPG, PNG, PDF and health record formats.": "जेपीजी, पीएनजी, पीडीएफ आणि आरोग्य रेकॉर्ड स्वरूपांना समर्थन देते.",
      "Upload Report": "अहवाल अपलोड करा",
      "Extracted text": "काढलेला मजकूर",
      "No extracted content yet.": "अद्याप कोणताही काढलेला मजकूर नाही.",
      "Clinical Report Chat": "वैद्यकीय अहवाल चॅट",
      "Live Developer Mode • Multipart Form Upload Pipeline": "लाइव्ह डेव्हलपर मोड • मल्टिपार्ट फॉर्म अपलोड पाइपलाइन",
      "Drop files here or click to select reports": "फाईल्स येथे ड्रॅग आणि ड्रॉप करा किंवा अहवाल निवडण्यासाठी क्लिक करा",
      "Cardiac": "हृदयविकार",
      "Endocrine": "अंतःस्रावी",
      "Respiratory": "श्वसन",
      "Dermatology": "त्वचा रोग",
      "AI report center": "अहवाल केंद्र",
      "Drag & drop upload": "ड्रॅग आणि ड्रॉप अपलोड",
      "OCR scan preview": "ओसीआर स्कॅन पूर्वावलोकन",
      "AI report analysis": "अहवाल विश्लेषण",
      "Report categories": "अहवाल श्रेणी",
      "CareLens Medication Planner • Keep your schedule seamless.": "केअरलेन्स औषध योजनाकार • आपले वेळापत्रक सुरळीत ठेवा.",
      "Medication reminders": "औषधाची स्मरणपत्रे",
      "Stay consistent with your daily dose. Check off when taken.": "तुमच्या रोजच्या डोससह सुसंगत रहा. औषध घेतल्यावर टिक करा.",
      "Current schedule": "चालू वेळापत्रक",
      "Add new medication": "नवीन औषध जोडा",
      "Medication Name": "औषधाचे नाव",
      "Dosage (e.g. 1 pill, 5ml)": "डोस (उदा. १ गोळी, ५ मिली)",
      "Timing (e.g. 08:00 AM)": "वेळ (उदा. सकाळी ०८:००)",
      "Frequency": "वारंवारता",
      "Everyday": "दररोज",
      "Twice a day": "दिवसातून दोनदा",
      "Add Reminder": "स्मरणपत्र जोडा",
      "Today’s medicine plan": "आजची औषध योजना",
      "Daily": "दररोज",
      "Pending": "लंबित",
      "Done": "पूर्ण",
      "Timeline": "टाइमलाईन",
      "Daily schedule": "रोजचे वेळापत्रक",
      "Schedule a new prescription schedule": "नवीन प्रिस्क्रिप्शन वेळापत्रक तयार करा",
      "Save Reminder": "स्मरणपत्र जतन करा",
      "Cancel": "रद्द करा",
      "Morning dose + hydration reminder.": "सकाळचा डोस + हायड्रेशन स्मरणपत्र.",
      "Evening supplement check.": "संध्याकाळचे सप्लीमेंट चेक.",
      "dose check scheduled.": "डोस चेक निर्धारित.",
      "CareLens Emergency • Designed for urgent health response.": "केअरलेन्स आपत्कालीन • तातडीच्या आरोग्य प्रतिसादासाठी डिझाइन केलेले.",
      "SOS Emergency Mode": "एसओएस आपत्कालीन मोड",
      "Tap SOS to alert nearby clinics and emergency contacts instantly.": "जवळचे क्लिनिक आणि आपत्कालीन संपर्कांना त्वरित अलर्ट करण्यासाठी एसओएस टॅप करा.",
      "SOS Activated": "एसओएस सक्रिय केले",
      "Simulating dispatch...": "सिम्युलेटिंग डिस्पॅच...",
      "Hospital": "रुग्णालय",
      "Distance": "अंतर",
      "Status": "स्थिती",
      "Contact": "संपर्क",
      "Emergency response": "आपत्कालीन प्रतिसाद",
      "Immediate care in one tap": "एका टॅपमध्ये तातडीची काळजी",
      "Emergency contacts": "आपत्कालीन संपर्क",
      "Family Contact": "कौटुंबिक संपर्क",
      "Primary Physician": "प्राथमिक डॉक्टर",
      "Emergency Services": "आपत्कालीन सेवा",
      "• Ambulance ETA:": "• रुग्णवाहिका येण्याची वेळ:",
      "• Emergency Services": "• आपत्कालीन सेवा",
      "• Family Contact": "• कौटुंबिक संपर्क",
      "• Primary Physician": "• प्राथमिक डॉक्टर",
      "Emergency readiness active": "आपत्कालीन तयारी सक्रिय",
      "Nearest hospital:": "जवळचे रुग्णालय:",
      "Starlight Hospital": "स्टारलाइट रुग्णालय",
      "Medical History Logs": "वैद्यकीय इतिहास नोंद",
      "Track your past symptoms, AI scans, and clinical outcomes over time.": "तुमच्या भूतकाळातील लक्षणे, एआई स्कॅन आणि वैद्यकीय परिणामांचा मागोवा घ्या.",
      "Search logs...": "लॉग शोधा...",
      "Date": "तारीख",
      "Symptom": "लक्षण",
      "Risk Level": "धोका पातळी",
      "Outcome": "निष्कर्ष",
      "Patient Care History": "रुग्ण इतिहास",
      "Review medical milestones, prescription details, and downloadable records curated for your health journey.": "तुमच्या आरोग्य प्रवासासाठी वैद्यकीय टप्पे, प्रिस्क्रिप्शन तपशील आणि डाउनलोड करण्यायोग्य रेकॉर्डचे पुनरावलोकन करा.",
      "Comprehensive logs": "सर्वसमावेशक लॉग",
      "CareLens Nearby • Precision local healthcare guidance.": "केअरलेन्स जवळचे दवाखाने • अचूक स्थानिक आरोग्य मार्गदर्शन.",
      "Nearby Healthcare Facilities": "जवळच्या आरोग्य सुविधा",
      "Find hospitals, pharmacies, and specialty clinics near you.": "तुमच्या जवळील रुग्णालये, औषधालये आणि विशेष क्लिनिक शोधण्यासाठी.",
      "Find medical centers, specialized clinics, and pharmacies near you with ratings, distances, and contact details.": "रेटिंग, अंतर आणि संपर्क तपशीलांसह तुमच्या जवळील वैद्यकीय केंद्रे, विशेष क्लिनिक आणि औषधालये शोधा.",
      "First Aid Pharmacy": "फर्स्ट एड फार्मसी",
      "Glow Pharmacy": "ग्लो फार्मसी",
      "Pulse Care Center": "पल्स केअर सेंटर",
      "Oasis Clinic": "ओएसिस क्लिनिक",
      "CarePoint Clinic": "केअरपॉइंट क्लिनिक",
      "Distance 1.1 km • Medicine delivery": "अंतर १.१ किमी • औषध वितरण",
      "Distance 1.2 km • ★★★★★": "अंतर १.२ किमी • ★★★★★",
      "Distance 1.8 km • Open 24/7": "अंतर १.८ किमी • २४/७ सुरू",
      "Distance 1.8 km • ★★★★★": "अंतर १.८ किमी • ★★★★★",
      "Distance 2.4 km • Ambulance available": "अंतर २.४ किमी • रुग्णवाहिका उपलब्ध",
      "Distance 2.7 km • ★★★★☆": "अंतर २.७ किमी • ★★★★☆",
      "Distance quick view": "अंतर द्रुत दृश्य",
      "Nearby Care Locations": "जवळची आरोग्य केंद्रे",
      "Map overview": "नकाशा विहंगावलोकन",
      "Top rated facilities": "सर्वोच्च रेटेड सुविधा",
      "Amara, I've logged these symptoms in your history. Based on the high score (urgent clinical indicator), I highly recommend scheduling a consultation or accessing SOS services on the Emergency page.": "अमारा, मी ही लक्षणे तुमच्या इतिहासात नोंदवली आहेत. उच्च स्कोअरच्या (तातडीचे वैद्यकीय सूचक) आधारावर, मी सल्लामसलत शेड्यूल करण्याची किंवा आपत्कालीन पृष्ठावरील एसओएस सेवा वापरण्याची शिफारस करतो.",
      "Amara, I've noted a moderate fatigue indicator. I have updated your dashboard guidelines. Hydration tracking is advised.": "अमारा, मी मध्यम थकवा निर्देशक नोंदवला आहे. मी तुमचे डॅशबोर्ड मार्गदर्शक तत्त्वे अपडेट केली आहेत. हायड्रेशन ट्रॅकिंगचा सल्ला दिला जातो.",
      "Amara, everything looks stable. I'll check back in at your next reminder window.": "अमारा, सर्व काही स्थिर दिसत आहे. मी तुमच्या पुढील स्मरणपत्र वेळी पुन्हा तपासेन.",
      "I've noted your input. Based on your symptoms profile, please monitor for any escalation in fever or chest tightness. Let me know if you would like me to explain any particular metrics.": "मी तुमचे इनपुट नोंदवले आहे. तुमच्या लक्षणांच्या प्रोफाइलवर आधारित, कृपया ताप किंवा छातीत घट्टपणा वाढण्यावर लक्ष ठेवा. तुम्हाला काही विशिष्ट घटक स्पष्ट हवे असल्यास मला सांगा.",
      "Chest tightness/pain is a high priority indicator. If it is accompanied by pressure, spreading pain, or shortness of breath, please access our Emergency/SOS dashboard or call medical services immediately.": "छातीत घट्टपणा/दुखणे हा उच्च प्राधान्याचा निर्देशक आहे. जर त्यासोबत दाब, पसरणारे दुखणे किंवा दम लागणे असे असेल तर कृपया आमच्या आपत्कालीन/एसओएस डॅशबोर्डवर जा किंवा वैद्यकीय सेवांशी त्वरित संपर्क साधा.",
      "For fever symptoms, monitor your temperature hourly. Keep hydrated (aim for 2-3 liters of water/electrolytes daily) and consider resting in a well-ventilated room.": "तापाच्या लक्षणांसाठी, तासाला तापमान तपासा. हायड्रेटेड रहा (दररोज २-३ लिटर पाणी/इलेक्ट्रोलाइट्स पिण्याचे ध्येय ठेवा) आणि हवेशीर खोलीत विश्रांती घेण्याचा विचार करा.",
      "You can ask me questions about your active symptoms, how to manage them, or request a summary of the clinical recommendations provided in the AI Analysis panel.": "तुम्ही तुमच्या लक्षणांबद्दल, त्याचे व्यवस्थापन कसे करावे याबद्दल प्रश्न विचारू शकता किंवा एआय विश्लेषण पॅनेलमध्ये दिलेल्या वैद्यकीय शिफारसींच्या सारांशाची विनंती करू शकता.",
      "You're welcome! CareLens is here to assist. Let me know if there's anything else you'd like to check.": "तुमचे स्वागत आहे! केअरलेन्स मदतीसाठी येथे आहे. तुम्हाला आणखी काही तपासायचे असल्यास मला सांगा.",
      "I can analyze your blood pressure or general report markers. Please upload a report to let me parse the values first, or ask general questions.": "मी तुमच्या रक्तदाब किंवा अहवाल निर्देशकांचे विश्लेषण करू शकतो. कृपया मला प्रथम मूल्ये विश्लेषित करण्यासाठी अहवाल अपलोड करा किंवा सामान्य प्रश्न विचारा.",
      "The extracted blood pressure is 118/76 mmHg. A systolic pressure below 120 and diastolic below 80 is clinically classified as Normal. This indicates excellent cardiovascular efficiency.": "काढलेला रक्तदाब ११८/७६ mmHg आहे. १२० पेक्षा कमी सिस्टोलिक दाब आणि ८० पेक्षा कमी डायस्टोलिक दाबाला सामान्य मानले जाते. हे उत्कृष्ट हृदय कार्यक्षमता दर्शवते.",
      "Your resting heart rate is extracted as 72 bpm. For adults, a normal resting heart rate ranges from 60 to 100 beats per minute. 72 bpm is optimal.": "तुमची विश्रांतीच्या वेळची हृदय गती ७२ bpm आढळली आहे. प्रौढांसाठी, सामान्य हृदय गती ६० ते १०० प्रति मिनिट असते. ७२ bpm हे उत्कृष्ट आहे.",
      "No elevated indicators or pathological flags (such as high cholesterol, high glucose, or abnormal liver enzymes) were identified in the scanned region.": "स्कॅन केलेल्या भागात कोणतेही वाढलेले निर्देशक किंवा आजाराचे संकेत (जसे की उच्च कोलेस्टेरॉल, उच्च ग्लुकोज किंवा यकृत एन्झाईम्स) आढळले नाहीत.",
      "Ask me to clarify clinical abbreviations or explain particular biometrics like blood pressure or heart rate from your uploaded document.": "तुमच्या अपलोड केलेल्या दस्तऐवजातील क्लिनिकल लघुरूपे स्पष्ट करण्यास किंवा रक्तदाब किंवा हृदय गती यांसारख्या घटकांचे स्पष्टीकरण देण्यास सांगा.",
      "Glad to help! Let me know if you have other markers you want to interpret.": "मदत करून आनंद झाला! तुमच्याकडे विश्लेषित करण्यासाठी इतर काही घटक असल्यास मला सांगा.",
      "I'm analyzing your health profile. Everything seems consistent with healthy recovery.": "मी तुमच्या आरोग्य प्रोफाइलचे विश्लेषण करत आहे. सर्व काही चांगल्या सुधारणेच्या अनुरूप दिसत आहे.",
      "Based on standard medical telemetry, keeping active hydration is highly recommended today.": "मानक वैद्यकीय माहितीच्या आधारे, आज पुरेसे पाणी पिण्याची शिफारस केली जाते.",
      "I've flagged your report for review. Your stress indices indicate mindfulness could help.": "मी तुमचा अहवाल पुनरावलोकनासाठी चिन्हांकित केला आहे. तुमचे ताण निर्देशक दर्शवतात की माइंडफुलनेस मदत करू शकते.",
      "Would you like me to add a reminder to help organize your schedule?": "आपले वेळापत्रक व्यवस्थित करण्यात मदत करण्यासाठी मी स्मरणपत्र जोडू का?",
      "Your fatigue telemetry looks normal, but let me know if you experience headaches.": "तुमचा थकवा सामान्य दिसत आहे, पण डोकेदुखी जाणवल्यास मला कळवा.",
      "Hello! Need help setting up your profile or primary healthcare goals?": "नमस्कार! आपले प्रोफाइल किंवा प्राथमिक आरोग्य उद्दिष्टे सेट करण्यात मदत हवी आहे?",
      "Hi 👋 I can help you with disease detection, medication reminders, or reports parsing.": "नमस्कार 👋 मी तुम्हाला आजार शोधण्यात, औषध स्मरणपत्रे किंवा अहवाल विश्लेषण करण्यात मदत करू शकतो.",
      "Hello 👋 How can I help you today?": "नमस्कार 👋 आज मी तुम्हाला कशी मदत करू शकतो?",
      "Hi, I'm the CareLens OCR report parser. Upload medical documents on the main screen to automatically parse biometric indicators. You can ask me questions about your reports here.": "नमस्कार, मी केअरलेन्स ओसीआर रिपोर्ट पार्सर आहे. बायोमेट्रिक निर्देशक स्वयंचलितपणे विश्लेषित करण्यासाठी मुख्य स्क्रीनवर वैद्यकीय दस्तऐवज अपलोड करा. तुम्ही मला येथे तुमच्या अहवालांबद्दल प्रश्न विचारू शकता.",
      "I can help with: disease detection, reminders, emergency support, and health awareness.": "मी आजार तपासणे, स्मरणपत्रे, आपत्कालीन सहाय्य आणि आरोग्य जागरूकता यासाठी मदत करू शकतो.",
      "I can guide you step-by-step.": "मी तुम्हाला पाऊल-दर-पाऊल मार्गदर्शन करू शकतो.",
      "Tip: Enter comma-separated symptoms or short phrases for best scan clarity.": "टीप: सर्वोत्तम स्कॅन स्पष्टतेसाठी स्वल्पविरामाने विभक्त केलेली लक्षणे किंवा लहान वाक्ये प्रविष्ट करा."
  }
  };

  const applyTranslations = (lang = localStorage.getItem('carelens-lang') || 'en') => {
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
            (node.classList && (node.classList.contains('mobile-menu-settings-section') || node.classList.contains('sidebar-settings-section'))) ||
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

    // Sync theme buttons in mobile settings
    document.querySelectorAll('.theme-btn-mobile').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'none';
      btn.style.borderColor = 'var(--border-color)';
      btn.style.color = 'var(--text-main)';
    });
    const activeMobThemeBtn = document.querySelector(`.theme-btn-mobile.theme-btn-${theme}`);
    if (activeMobThemeBtn) {
      activeMobThemeBtn.classList.add('active');
      activeMobThemeBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      activeMobThemeBtn.style.borderColor = 'transparent';
      activeMobThemeBtn.style.color = 'white';
    }

    // Sync theme buttons in sidebar settings
    document.querySelectorAll('.theme-btn-sidebar').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'none';
      btn.style.borderColor = 'var(--border-color)';
      btn.style.color = 'var(--text-main)';
    });
    const activeSideThemeBtn = document.querySelector(`.theme-btn-sidebar.theme-btn-${theme}`);
    if (activeSideThemeBtn) {
      activeSideThemeBtn.classList.add('active');
      activeSideThemeBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      activeSideThemeBtn.style.borderColor = 'transparent';
      activeSideThemeBtn.style.color = 'white';
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

  // Expose variables globally
  window.applyTranslations = applyTranslations;
  window.applyTheme = applyTheme;
});