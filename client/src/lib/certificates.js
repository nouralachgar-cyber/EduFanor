import { apiRequest } from './api';

export function getCourseCertificate(courseKey) {
  return apiRequest(`/certificates/${encodeURIComponent(courseKey)}`, { auth: true });
}

export function listCourseCertificates() {
  return apiRequest('/certificates', { auth: true });
}

function serializeSvg(svgElement) {
  const clone = svgElement.cloneNode(true);
  const viewBox = svgElement.viewBox?.baseVal;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(viewBox?.width || 1122));
  clone.setAttribute('height', String(viewBox?.height || 794));
  const source = new XMLSerializer().serializeToString(clone);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to render the certificate image.'));
    image.src = source;
  });
}

function dataUrlBytes(dataUrl) {
  const base64 = String(dataUrl).split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function buildPdf(jpegBytes, width, height) {
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;

  const pushText = (value) => {
    const bytes = encoder.encode(value);
    parts.push(bytes);
    length += bytes.length;
  };
  const pushBytes = (bytes) => {
    parts.push(bytes);
    length += bytes.length;
  };
  const markObject = (index) => {
    offsets[index] = length;
    return index;
  };

  const content = 'q\n842 0 0 595 0 0 cm\n/Im0 Do\nQ\n';

  pushText('%PDF-1.4\n');
  pushText(`${markObject(1)} 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  pushText(`${markObject(2)} 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
  pushText(
    `${markObject(3)} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`
  );
  pushText(`${markObject(4)} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
  pushText(
    `${markObject(5)} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushText('\nendstream\nendobj\n');

  const xrefOffset = length;
  pushText('xref\n0 6\n0000000000 65535 f \n');
  for (let index = 1; index <= 5; index += 1) {
    pushText(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  }
  pushText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(parts, { type: 'application/pdf' });
}

export async function downloadCertificatePdf(svgElement, fileName = 'EduFanor-Certificate.pdf') {
  if (!svgElement) throw new Error('Certificate document is not ready.');
  const image = await loadImage(serializeSvg(svgElement));
  const canvas = document.createElement('canvas');
  canvas.width = 3508;
  canvas.height = 2480;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const jpegBytes = dataUrlBytes(canvas.toDataURL('image/jpeg', 0.94));
  const blob = buildPdf(jpegBytes, canvas.width, canvas.height);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
