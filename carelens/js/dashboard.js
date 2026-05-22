/* ====================================================
   CareLens AI - Dashboard Charts Rendering
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const hydrationCtx = document.getElementById('hydrationChart');
  const sleepCtx = document.getElementById('sleepChart');

  // Resolve design values dynamically or from style system
  const textSoft = '#64748b';
  const borderColor = 'rgba(79, 172, 254, 0.12)';
  const primaryColor = '#4facfe';
  const secondaryColor = '#7b61ff';

  if (hydrationCtx) {
    new Chart(hydrationCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hydration (ml)',
          data: [1800, 1950, 2100, 2200, 2050, 2300, 2400],
          borderColor: primaryColor,
          backgroundColor: 'rgba(79, 172, 254, 0.15)',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: primaryColor,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: borderColor }, ticks: { color: textSoft } },
          y: { grid: { color: borderColor }, ticks: { color: textSoft } }
        }
      }
    });
  }

  if (sleepCtx) {
    new Chart(sleepCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hours asleep',
          data: [7, 6.5, 8, 7.2, 6.8, 8.5, 7.9],
          borderRadius: 14,
          backgroundColor: 'rgba(123, 97, 255, 0.72)',
          hoverBackgroundColor: 'rgba(79, 172, 254, 0.86)',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textSoft } },
          y: { grid: { color: borderColor }, ticks: { color: textSoft, stepSize: 1 } }
        }
      }
    });
  }
});
