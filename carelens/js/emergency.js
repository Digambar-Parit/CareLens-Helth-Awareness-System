/* ====================================================
   CareLens AI - Emergency Response Interactive Logic
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const sosButton = document.querySelector('.emergency-button');
  const alertPanel = document.querySelector('.alert-panel');

  if (sosButton && alertPanel) {
    sosButton.addEventListener('click', () => {
      // Style active state
      alertPanel.style.border = '1px solid var(--danger)';
      alertPanel.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.25)';
      alertPanel.style.background = 'rgba(239, 68, 68, 0.08)';
      
      const originalHtml = sosButton.innerHTML;
      sosButton.innerHTML = `<i data-lucide="check-circle" style="width:20px; height:20px;"></i> SOS Activated`;
      if (window.lucide) window.lucide.replace();
      
      sosButton.disabled = true;
      sosButton.style.opacity = '0.8';

      setTimeout(() => {
        sosButton.innerHTML = originalHtml;
        if (window.lucide) window.lucide.replace();
        
        sosButton.disabled = false;
        sosButton.style.opacity = '1';
        
        // Reset state
        alertPanel.style.border = '1px solid rgba(239, 68, 68, 0.15)';
        alertPanel.style.boxShadow = 'none';
        alertPanel.style.background = 'rgba(239, 68, 68, 0.05)';
      }, 3500);
    });
  }
});
