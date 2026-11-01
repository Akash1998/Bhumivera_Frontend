const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');
const zxing = require('@zxing/library');

const CODE_TEXT = '8492-7105-3824';
const QR_URL = `https://bhumivera.com/verify?qr=${CODE_TEXT}`;

// 1. Generate standard QR SVG using the official QRCode library (ISO-compliant)
QRCode.toString(QR_URL, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 3,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
}, (err, rawSvg) => {
  if (err) throw err;

  // 2. Read official uploaded logo (JPG)
  const logoPath = path.resolve(__dirname, '../public/bhumivera-official-logo.jpg');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  // The raw SVG viewBox is typically "0 0 43 43" (37 modules + 2*3 margin = 43)
  const match = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const totalSize = match ? Number(match[1]) : 43;
  const center = totalSize / 2; // 21.5
  const logoRadius = 4.8; // ~9.6 modules wide out of 37 = ~25% diameter, ~6% area (well within 30% Level H)

  // 3. Inject center logo into SVG before closing </svg>
  const logoOverlay = `
  <defs>
    <clipPath id="centerLogoClip">
      <circle cx="${center}" cy="${center}" r="${logoRadius}" />
    </clipPath>
  </defs>
  <!-- Center Logo Isolation Pad -->
  <circle cx="${center}" cy="${center}" r="${logoRadius + 0.4}" fill="#ffffff" />
  <circle cx="${center}" cy="${center}" r="${logoRadius + 0.2}" fill="#000000" />
  <!-- Embedded Official Bhumivera Tree of Life Logo -->
  <image
    x="${center - logoRadius}"
    y="${center - logoRadius}"
    width="${logoRadius * 2}"
    height="${logoRadius * 2}"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#centerLogoClip)"
    href="data:image/jpeg;base64,${logoBase64}"
  />
  <circle cx="${center}" cy="${center}" r="${logoRadius}" fill="none" stroke="#d4af37" stroke-width="0.3" />
</svg>`;

  const finalSvg = rawSvg.replace('</svg>', logoOverlay);

  const outSvgPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.svg');
  fs.writeFileSync(outSvgPath, finalSvg, 'utf8');
  console.log('Saved Standard ISO QR SVG with Logo to:', outSvgPath, 'Size:', finalSvg.length);

  // 4. Render 600x600 PNG using Edge headless
  const renderHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 600px;
      height: 600px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .wrapper {
      width: 560px;
      height: 560px;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
      shape-rendering: crispEdges;
    }
  </style>
</head>
<body>
  <div class="wrapper">${finalSvg}</div>
</body>
</html>`;

  const renderHtmlPath = path.resolve(__dirname, '../public/qr-render-temp.html');
  fs.writeFileSync(renderHtmlPath, renderHtml, 'utf8');

  const outPngPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.png');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  if (fs.existsSync(edgePath)) {
    try {
      execSync(`"${edgePath}" --headless --disable-gpu --window-size=600,600 --screenshot="${outPngPath}" "file:///${renderHtmlPath.replace(/\\\\/g, '/')}"`);
      console.log('Rendered High-Res Standard PNG with Logo to:', outPngPath);
    } catch (err) {
      console.error('Edge screenshot error:', err.message);
    }
  }
  fs.unlinkSync(renderHtmlPath);
});
