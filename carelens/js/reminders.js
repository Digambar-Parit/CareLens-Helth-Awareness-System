/* ====================================================
   CareLens AI - Medication Planner Logic
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('addReminderBtn') || document.querySelector('.reminder-panel button');
  const medicineCardsContainer = document.querySelector('.medicine-cards');
  const timelinePanel = document.querySelector('.timeline-panel');
  const scheduleGrid = document.querySelector('.schedule-grid');

  // Helper to format time strings (24h HH:MM to 12h AM/PM)
  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutesStr} ${ampm}`;
  }

  // Helper to determine time block (Morning, Midday, Evening)
  function getTimeBlock(timeStr) {
    if (!timeStr) return 'Midday';
    const hours = parseInt(timeStr.split(':')[0], 10);
    if (hours < 12) return 'Morning';
    if (hours < 18) return 'Midday';
    return 'Evening';
  }

  // 1. Hook up toggle behaviors for existing/new medicine status chips
  function registerChipToggle(card) {
    const chip = card.querySelector('.chip, .chip-btn, .status-pill');
    if (!chip) return;

    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim().toLowerCase();
      if (text === 'pending' || text === 'scheduled') {
        chip.className = 'chip';
        chip.style.background = 'rgba(34, 197, 94, 0.1)';
        chip.style.borderColor = 'var(--success)';
        chip.style.color = 'var(--success)';
        chip.textContent = 'Done';
      } else {
        chip.className = 'chip secondary-btn';
        chip.style.background = '';
        chip.style.borderColor = '';
        chip.style.color = '';
        chip.textContent = 'Pending';
      }
    });
  }

  // Set up initially rendered cards
  const existingCards = document.querySelectorAll('.medicine-card');
  existingCards.forEach(registerChipToggle);

  // 2. Build and trigger modal inputs
  function buildModal() {
    const overlay = document.createElement('div');
    overlay.className = 'reminder-modal';
    overlay.innerHTML = `
      <div class="modal-card glass-card">
        <div>
          <h3>Add Reminder</h3>
          <p class="section-subtitle" style="margin: 0; text-align: left;">Schedule a new prescription schedule</p>
        </div>
        <div>
          <label for="medicineName">Medicine Name</label>
          <input type="text" placeholder="e.g. Paracetamol, Omega 3" id="medicineName" name="medicineName" required />
        </div>
        <div>
          <label for="medicineTime">Dose Time</label>
          <input type="time" id="medicineTime" name="medicineTime" required />
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" id="cancelBtn" style="padding: 10px 20px;">Cancel</button>
          <button class="btn" id="saveBtn" style="padding: 10px 20px;">Save Reminder</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);

    const nameInput = overlay.querySelector('#medicineName');
    const timeInput = overlay.querySelector('#medicineTime');
    const saveBtn = overlay.querySelector('#saveBtn');
    const cancelBtn = overlay.querySelector('#cancelBtn');

    nameInput.focus();

    // Close function with quick fade anim
    const closeModal = () => {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s ease';
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const time = timeInput.value;

      if (!name || !time) {
        nameInput.style.borderColor = 'var(--danger)';
        timeInput.style.borderColor = 'var(--danger)';
        return;
      }

      // Add to list
      if (medicineCardsContainer) {
        const newCard = document.createElement('div');
        newCard.className = 'medicine-card';
        newCard.innerHTML = `
          <div>
            <h4>${name}</h4>
            <p>${formatTime(time)} • Daily</p>
          </div>
          <span class="chip secondary-btn">Pending</span>
        `;
        medicineCardsContainer.appendChild(newCard);
        registerChipToggle(newCard);
      }

      // Add to Timeline
      if (timelinePanel) {
        const newTimelineItem = document.createElement('div');
        newTimelineItem.className = 'timeline-item';
        newTimelineItem.innerHTML = `
          <strong>${time}</strong>
          <p>${name} dose check scheduled.</p>
        `;
        timelinePanel.appendChild(newTimelineItem);
      }

      // Add to Daily Schedule blocks
      if (scheduleGrid) {
        const timeBlock = getTimeBlock(time);
        // Find existing schedule column matching morning/midday/evening
        const cols = scheduleGrid.querySelectorAll('.schedule-card');
        cols.forEach(col => {
          const blockName = col.querySelector('p').textContent.toLowerCase();
          if (blockName === timeBlock.toLowerCase()) {
            const medText = col.querySelector('strong');
            if (medText.textContent === 'None' || medText.textContent === 'Supplement' || medText.textContent === 'Medication') {
              medText.textContent = name;
            } else {
              medText.textContent += `, ${name}`;
            }
          }
        });
      }

      closeModal();
      
      // Dynamic micro notification simulation
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--text-main);
        color: var(--bg-white);
        padding: 12px 24px;
        border-radius: var(--radius-sm);
        z-index: 1001;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        transition: all 0.3s ease;
      `;
      toast.textContent = `✓ ${name} scheduled for ${formatTime(time)}`;
      document.body.appendChild(toast);
      
      // trigger reflow for transitions
      toast.offsetHeight;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    });
  }

  if (addButton) {
    addButton.addEventListener('click', buildModal);
  }
});
