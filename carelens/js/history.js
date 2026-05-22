document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('.search-panel input');
  const historyItems = document.querySelectorAll('.history-item');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      historyItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }
});
