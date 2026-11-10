const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');

const CODE_TEXT = '8492-7105-3824';
const QR_URL = `https://bhumivera.com/verify?qr=${CODE_TEXT}`;

// 1. Generate QR matrix with Error Correction Level H
const qr = QRCode.create(QR_URL, { errorCorrectionLevel: 'H' });
const size = qr.modules.size; // 37 for version 5
const moduleData = qr.modules;

// 2. Read official uploaded logo (JPG) to embed as base64
const officialLogoPath = path.resolve(__dirname, '../public/bhumivera-official-logo.jpg');
let logoBase64 = '';
let logoMime = 'image/jpeg';

if (fs.existsSync(officialLogoPath)) {
  logoBase64 = fs.readFileSync(officialLogoPath).toString('base64');
  logoMime = 'image/jpeg';
} else {
  const fallbackPath = path.resolve(__dirname, '../public/assets/bhumivera-official-logo.jpg');
  if (fs.existsSync(fallbackPath)) {
    logoBase64 = fs.readFileSync(fallbackPath).toString('base64');
    logoMime = 'image/jpeg';
  }
}

// 3. Layout geometry
// SVG canvas: 440 x 440
// Padding: 35px each side
// Grid area: 370 x 370 -> module size = 370 / 37 = 10px per module
const padding = 35;
const moduleSize = 10;
const canvasSize = padding * 2 + size * moduleSize; // 35 * 2 + 370 = 440

// Helper to check if a module is inside one of the 3 finder patterns
const isFinderPattern = (r, c) => {
  // Top-left
  if (r >= 0 && r < 7 && c >= 0 && c < 7) return true;
  // Top-right
  if (r >= 0 && r < 7 && c >= size - 7 && c < size) return true;
  // Bottom-left
  if (r >= size - 7 && r < size && c >= 0 && c < 7) return true;
  return false;
};

// Center logo zone: center is (18, 18). Protect 9x9 zone (rows 14..22, cols 14..22)
const centerMin = 14;
const centerMax = 22;
const isCenterZone = (r, c) => (r >= centerMin && r <= centerMax && c >= centerMin && c <= centerMax);

// Generate Data Module SVGs
let modulesSvg = '';
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (isFinderPattern(r, c) || isCenterZone(r, c)) continue;
    if (moduleData.get(r, c)) {
      const x = padding + c * moduleSize;
      const y = padding + r * moduleSize;
      // High-contrast rounded pill module for smooth modern aesthetic
      modulesSvg += `<rect x="${x + 0.8}" y="${y + 0.8}" width="${moduleSize - 1.6}" height="${moduleSize - 1.6}" rx="2.5" ry="2.5" fill="#070a0e" />\n`;
    }
  }
}

// Generate Custom Luxury Finder Patterns
const drawFinderPattern = (originRow, originCol) => {
  const x = padding + originCol * moduleSize;
  const y = padding + originRow * moduleSize;
  const w = 7 * moduleSize; // 70px

  return `
    <g class="finder-eye">
      <!-- Outer Ring -->
      <rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${w - 2}" rx="14" ry="14" fill="#070a0e" stroke="url(#goldGradient)" stroke-width="3" />
      <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${w - 20}" rx="9" ry="9" fill="#ffffff" />
      <!-- Center Jewel -->
      <rect x="${x + 20}" y="${y + 20}" width="${w - 40}" height="${w - 40}" rx="6" ry="6" fill="url(#goldGradient)" stroke="#997819" stroke-width="1.2" />
      <circle cx="${x + w / 2}" cy="${y + w / 2}" r="3" fill="#ffffff" opacity="0.8" />
    </g>
  `;
};

const finderTopLeft = drawFinderPattern(0, 0);
const finderTopRight = drawFinderPattern(0, size - 7);
const finderBottomLeft = drawFinderPattern(size - 7, 0);

// Center Emblem Position
const centerPixel = padding + (size / 2) * moduleSize; // 220px
const medallionRadius = 46;

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${canvasSize} ${canvasSize}" width="100%" height="100%" shape-rendering="geometricPrecision">
  <defs>
    <!-- Imperial Maison Gold Linear Gradient -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff2b8" />
      <stop offset="35%" stop-color="#d4af37" />
      <stop offset="70%" stop-color="#fce096" />
      <stop offset="100%" stop-color="#997819" />
    </linearGradient>

    <!-- Subtle Metallic Radial Glow -->
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#14291f" stop-opacity="0.95" />
      <stop offset="85%" stop-color="#0a1410" stop-opacity="1" />
      <stop offset="100%" stop-color="#050a08" stop-opacity="1" />
    </radialGradient>

    <!-- Circular Clip for Official Bhumivera Logo -->
    <clipPath id="logoCircleClip">
      <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius}" />
    </clipPath>

    <!-- Drop Shadows for 3D Luxury Elevation -->
    <filter id="medallionShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.5" />
    </filter>
    <filter id="plateShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- High-Contrast Clean Ivory Plate with Gold Border -->
  <rect x="6" y="6" width="${canvasSize - 12}" height="${canvasSize - 12}" rx="22" ry="22" fill="#ffffff" stroke="url(#goldGradient)" stroke-width="2.5" filter="url(#plateShadow)" />
  <rect x="12" y="12" width="${canvasSize - 24}" height="${canvasSize - 24}" rx="18" ry="18" fill="none" stroke="rgba(212, 175, 55, 0.3)" stroke-width="0.8" />

  <!-- Corner Filigree Accents -->
  <path d="M 18 28 L 28 18" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" />
  <path d="M ${canvasSize - 18} 28 L ${canvasSize - 28} 18" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" />
  <path d="M 18 ${canvasSize - 28} L 28 ${canvasSize - 18}" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" />
  <path d="M ${canvasSize - 18} ${canvasSize - 28} L ${canvasSize - 28} ${canvasSize - 18}" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" />

  <!-- 3 Unique Luxury Finder Eyes -->
  ${finderTopLeft}
  ${finderTopRight}
  ${finderBottomLeft}

  <!-- Smooth Rounded Data Modules -->
  <g class="qr-modules">
    ${modulesSvg}
  </g>

  <!-- Center Bhumivera Logo Medallion Zone -->
  <g class="center-medallion" filter="url(#medallionShadow)">
    <!-- Protective White Isolation Base -->
    <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius + 5}" fill="#ffffff" />
    <!-- Outer Gold Bezel -->
    <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius + 3}" fill="none" stroke="url(#goldGradient)" stroke-width="3" />
    <!-- Dark Botanical Inner Disc -->
    <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius}" fill="#070a0e" />

    ${logoBase64 ? `
    <!-- Official Bhumivera Tree of Life Logo with Circular Clip -->
    <image
      x="${centerPixel - medallionRadius}"
      y="${centerPixel - medallionRadius}"
      width="${medallionRadius * 2}"
      height="${medallionRadius * 2}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#logoCircleClip)"
      href="data:${logoMime};base64,${logoBase64}"
    />
    ` : `
    <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius}" fill="url(#centerGlow)" />
    <text x="${centerPixel}" y="${centerPixel - 2}" text-anchor="middle" font-family="'Cinzel', serif" font-size="18" font-weight="900" fill="#fce096" letter-spacing="1.5">BV</text>
    <text x="${centerPixel}" y="${centerPixel + 13}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7" font-weight="700" fill="#d4af37" letter-spacing="2">MAISON</text>
    `}

    <!-- Fine Gold Overlay Hairline Ring -->
    <circle cx="${centerPixel}" cy="${centerPixel}" r="${medallionRadius}" fill="none" stroke="url(#goldGradient)" stroke-width="1.8" />
  </g>
</svg>
`;

const outputPathSvg = path.resolve(__dirname, '../public/bhumivera-gift-qr.svg');
fs.writeFileSync(outputPathSvg, svgContent, 'utf8');
console.log('Saved Designer SVG with official logo to:', outputPathSvg, 'Length:', svgContent.length);

// Also generate standalone HTML to render high-res PNG with Edge headless
const renderHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 600px; height: 600px; background: #070a0e; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .wrapper { width: 560px; height: 560px; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <div class="wrapper">${svgContent}</div>
</body>
</html>`;

const renderHtmlPath = path.resolve(__dirname, '../public/qr-render-temp.html');
fs.writeFileSync(renderHtmlPath, renderHtml, 'utf8');

const outputPathPng = path.resolve(__dirname, '../public/bhumivera-gift-qr.png');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgePath)) {
  try {
    execSync(`"${edgePath}" --headless --disable-gpu --window-size=600,600 --screenshot="${outputPathPng}" "file:///${renderHtmlPath.replace(/\\\\/g, '/')}"`);
    console.log('Rendered high-res PNG with official logo to:', outputPathPng);
  } catch (err) {
    console.error('Edge screenshot error:', err.message);
  }
}
fs.unlinkSync(renderHtmlPath);
