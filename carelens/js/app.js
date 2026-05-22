document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) {
    window.lucide.replace({ width: 18, height: 18, color: 'currentColor' });
  }

  AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-out-cubic',
  });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  const chatToggle = document.querySelector('[data-chat-toggle]');
  const chatPanel = document.querySelector('[data-chat-panel]');
  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
      chatPanel.classList.toggle('visible');
    });
  }

  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.copy);
      if (target) {
        navigator.clipboard.writeText(target.textContent.trim());
        button.textContent = 'Copied';
        setTimeout(() => (button.textContent = 'Copy'), 1400);
      }
    });
  });
});
