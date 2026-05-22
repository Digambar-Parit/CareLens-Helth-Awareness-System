document.addEventListener('DOMContentLoaded', function () {
  const hydrationCtx = document.getElementById('hydrationChart');
  const sleepCtx = document.getElementById('sleepChart');

  if (hydrationCtx) {
    new Chart(hydrationCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hydration (ml)',
          data: [1800, 1950, 2100, 2200, 2050, 2300, 2400],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.2)',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#cbd5e1' } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#cbd5e1' } }
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
          backgroundColor: 'rgba(124, 58, 237, 0.72)',
          hoverBackgroundColor: 'rgba(56, 189, 248, 0.86)',
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#cbd5e1', stepSize: 1 } }
        }
      }
    });
  }
});
