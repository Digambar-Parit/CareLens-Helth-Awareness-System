document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.place-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
});
