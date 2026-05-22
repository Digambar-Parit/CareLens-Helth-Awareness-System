document.addEventListener('DOMContentLoaded', function () {
  const dropzone = document.getElementById('dropzone');
  const ocrPreview = document.getElementById('ocrPreview');
  const extractedText = document.getElementById('extractedText');

  const analyzeReport = async (file) => {
    if (ocrPreview) ocrPreview.textContent = `Processing file: ${file.name}...`;
    if (extractedText) extractedText.textContent = 'Analyzing with AI...';

    const formData = new FormData();
    formData.append('report', file);

    try {
      const data = await api.post('/reports/analyze-report', formData, true);
      if (data.error) {
        alert(data.error);
        return;
      }
      if (ocrPreview) ocrPreview.textContent = `Extracted text from: ${file.name}`;
      if (extractedText) {
        const { analysis } = data;
        extractedText.textContent = `Summary: ${analysis.summary}\n\nMarkers: ${analysis.markers}\n\nAbnormalities: ${analysis.abnormalities}\n\nSuggestions: ${analysis.suggestions}`;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to analyze report');
    }
  };

  if (!dropzone) return;

  dropzone.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.onchange = () => {
      if (fileInput.files.length) analyzeReport(fileInput.files[0]);
    };
    fileInput.click();
  });

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.style.borderColor = '#38bdf8';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'rgba(255,255,255,0.16)';
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.style.borderColor = 'rgba(255,255,255,0.16)';
    if (event.dataTransfer.files.length) {
      analyzeReport(event.dataTransfer.files[0]);
    }
  });
});
