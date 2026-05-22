document.addEventListener('DOMContentLoaded', function () {
  const dropzone = document.getElementById('dropzone');
  const ocrPreview = document.getElementById('ocrPreview');
  const extractedText = document.getElementById('extractedText');

  const simulateExtraction = (name) => {
    if (ocrPreview) ocrPreview.textContent = `Uploaded file: ${name}`;
    if (extractedText) extractedText.textContent = `Extracted medical observations from ${name}:\n- Blood pressure 118/76 mmHg\n- Stable heart rate 72 bpm\n- No abnormal markers detected\n- Recommended follow-up in two weeks`;
  };

  if (!dropzone) return;

  dropzone.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.onchange = () => {
      if (fileInput.files.length) simulateExtraction(fileInput.files[0].name);
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
      simulateExtraction(event.dataTransfer.files[0].name);
    }
  });
});
