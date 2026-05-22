document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.querySelector('.reminder-panel .btn');

  function buildModal() {
    const overlay = document.createElement('div');
    overlay.className = 'reminder-modal';
    overlay.innerHTML = `
      <div class="modal-card glass-card">
        <h3>Add Reminder</h3>
        <input type="text" placeholder="Medication name" id="medicineName" />
        <input type="time" id="medicineTime" />
        <button class="btn">Save reminder</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
    overlay.querySelector('button').addEventListener('click', () => {
      overlay.remove();
      alert('Reminder added to your schedule');
    });
  }

  if (addButton) {
    addButton.addEventListener('click', buildModal);
  }
});
