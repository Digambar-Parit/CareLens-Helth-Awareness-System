document.addEventListener('DOMContentLoaded', function () {
  const sosButton = document.querySelector('.emergency-button');
  const alertPanel = document.querySelector('.alert-panel');

  if (sosButton && alertPanel) {
    sosButton.addEventListener('click', () => {
      alertPanel.style.border = '1px solid rgba(255, 77, 109, 0.6)';
      alertPanel.style.boxShadow = '0 0 40px rgba(255, 77, 109, 0.3)';
      sosButton.textContent = 'SOS activated';
      sosButton.disabled = true;
      sosButton.style.opacity = '0.9';
      setTimeout(() => {
        sosButton.textContent = 'Activate SOS';
        sosButton.disabled = false;
        alertPanel.style.border = 'none';
        alertPanel.style.boxShadow = 'none';
      }, 3500);
    });
  }
});
