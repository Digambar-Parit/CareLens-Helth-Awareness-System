document.addEventListener('DOMContentLoaded', function () {
  const chips = document.querySelectorAll('.chip-btn');
  const uploadZone = document.getElementById('uploadZone');
  const uploadPreview = document.getElementById('uploadPreview');
  const symptomInput = document.getElementById('symptomInput');
  const submitSymptomsBtn = document.getElementById('submitSymptomsBtn');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // Handle symptom submission
  if (submitSymptomsBtn && symptomInput) {
    submitSymptomsBtn.addEventListener('click', () => {
      submitSymptoms();
    });

    symptomInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        submitSymptoms();
      }
    });
  }

  async function submitSymptoms() {
    const symptoms = symptomInput.value.trim();
    if (!symptoms) return;

    try {
      submitSymptomsBtn.textContent = 'Analyzing...';
      const data = await api.post('/prediction/predict', { symptoms });
      submitSymptomsBtn.textContent = 'Get analysis';

      if (data.error) {
        alert(data.error);
        return;
      }

      // Display the results (you might want to add a proper UI for this)
      const resultMsg = `Diagnosis: ${data.diagnosis}\nSeverity: ${data.severity}\n\nTips: ${data.awarenessTips}`;
      alert(resultMsg);
      symptomInput.value = '';
    } catch (err) {
      console.error(err);
      alert('Failed to get prediction');
      submitSymptomsBtn.textContent = 'Get analysis';
    }
  }

  if (uploadZone) {
    uploadZone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.png,.jpg,.jpeg,.pdf';
      input.onchange = () => {
        if (input.files.length) {
          uploadPreview.textContent = input.files[0].name;
        }
      };
      input.click();
    });

    uploadZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      uploadZone.style.borderColor = '#38bdf8';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'rgba(255,255,255,0.16)';
    });

    uploadZone.addEventListener('drop', (event) => {
      event.preventDefault();
      uploadZone.style.borderColor = 'rgba(255,255,255,0.16)';
      if (event.dataTransfer.files.length) {
        uploadPreview.textContent = event.dataTransfer.files[0].name;
      }
    });
  }
});
