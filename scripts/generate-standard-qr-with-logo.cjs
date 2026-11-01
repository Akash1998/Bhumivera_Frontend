const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');
const zxing = require('@zxing/library');

async function generateNormalQrWithLogo() {
  const CODE_TEXT = '8492-7105-3824';
  const QR_URL = `https://bhumivera.com/verify?qr=${CODE_TEXT}`;
  const logoPath = path.resolve(__dirname, '../public/bhumivera-official-logo.jpg');
  
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo not found at ${logoPath}`);
  }

  console.log('Generating QR code matrix with Error Correction Level H...');
  const qr = QRCode.create(QR_URL, {
    errorCorrectionLevel: 'H'
  });

  const moduleCount = qr.modules.size; // e.g. 37 modules
  const margin = 4; // ISO standard quiet zone is 4 modules
  const totalModules = moduleCount + margin * 2; // e.g. 45 modules
  
  // High-res output size (e.g. 900x900px, 20px per module)
  const scale = 20;
  const imageSize = totalModules * scale; // 45 * 20 = 900px
  
  console.log(`QR Module Count: ${moduleCount}x${moduleCount}, Total with margin: ${totalModules}x${totalModules}, Image size: ${imageSize}x${imageSize}px`);

  // Calculate center logo size in modules and pixels
  // In Level H (30% redundancy), a center logo covering ~9 modules out of 37 covers ~6% of total area
  const centerModuleRadius = 4.8; // diameter ~9.6 modules out of 37 (26% of width, 6.7% of area)
  const centerPx = (totalModules / 2) * scale; // 450px
  const logoRadiusPx = Math.round(centerModuleRadius * scale); // ~96px -> diameter 192px
  const padRadiusPx = logoRadiusPx + 8; // 8px white isolation pad border

  // 1. Build crisp, standard SVG using exact square <rect> elements for each dark module
  let svgModules = '';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.modules.get(r, c)) {
        const x = (c + margin) * scale;
        const y = (r + margin) * scale;
        // Don't draw modules that are completely hidden behind the center logo isolation pad
        const distFromCenter = Math.hypot((x + scale/2) - centerPx, (y + scale/2) - centerPx);
        if (distFromCenter < padRadiusPx - 4) {
          continue; // skip modules covered by center logo to keep vector file clean
        }
        svgModules += `<rect x="${x}" y="${y}" width="${scale}" height="${scale}" fill="#000000" />\n`;
      }
    }
  }

  // Read base64 of official logo
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDiameterPx = logoRadiusPx * 2;
  const logoLeftPx = centerPx - logoRadiusPx;
  const logoTopPx = centerPx - logoRadiusPx;

  // Complete self-contained SVG
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageSize} ${imageSize}" width="${imageSize}" height="${imageSize}">
  <defs>
    <clipPath id="centerLogoClip">
      <circle cx="${centerPx}" cy="${centerPx}" r="${logoRadiusPx}" />
    </clipPath>
  </defs>
  <!-- Clean white background -->
  <rect x="0" y="0" width="${imageSize}" height="${imageSize}" fill="#ffffff" />
  
  <!-- Standard ISO QR Code Modules -->
  ${svgModules}
  
  <!-- Center Logo White Isolation Pad -->
  <circle cx="${centerPx}" cy="${centerPx}" r="${padRadiusPx}" fill="#ffffff" stroke="#e0e0e0" stroke-width="1" />
  
  <!-- Embedded Official Bhumivera Tree of Life Logo -->
  <image
    x="${logoLeftPx}"
    y="${logoTopPx}"
    width="${logoDiameterPx}"
    height="${logoDiameterPx}"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#centerLogoClip)"
    href="data:image/jpeg;base64,${logoBase64}"
  />
  
  <!-- Elegant Golden Accent Ring around Logo -->
  <circle cx="${centerPx}" cy="${centerPx}" r="${logoRadiusPx}" fill="none" stroke="#d4af37" stroke-width="3" />
</svg>`;

  // 2. Save SVG files
  const frontendSvgPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.svg');
  const brainSvgPath = 'C:/Users/akash/.gemini/antigravity/brain/b8d9cacb-7767-4905-b790-6a52b0a1b5bb/bhumivera-gift-qr.svg';

  fs.writeFileSync(frontendSvgPath, svgContent, 'utf8');
  fs.writeFileSync(brainSvgPath, svgContent, 'utf8');
  console.log('Saved clean standard SVG with logo to:', frontendSvgPath);

  // 3. Render High-Res PNG using Sharp (100% native rasterization, razor-sharp)
  const frontendPngPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.png');
  const brainPngPath = 'C:/Users/akash/.gemini/antigravity/brain/b8d9cacb-7767-4905-b790-6a52b0a1b5bb/bhumivera-gift-qr.png';

  const pngBuffer = await sharp(Buffer.from(svgContent))
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(frontendPngPath, pngBuffer);
  fs.writeFileSync(brainPngPath, pngBuffer);
  console.log('Rendered 900x900px high-res PNG to:', frontendPngPath, 'Size:', pngBuffer.length, 'bytes');

  // 4. Test decode using ZXing
  console.log('\n--- VERIFYING SCANNER COMPATIBILITY (ZXing) ---');
  const { data, info } = await sharp(frontendPngPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const luminances = new Uint8ClampedArray(info.width * info.height);
  for (let i = 0; i < luminances.length; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    luminances[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  class CustomLuminanceSource extends zxing.LuminanceSource {
    constructor(lum, w, h) {
      super(w, h);
      this.lum = lum;
    }
    getRow(y, row) {
      const w = this.getWidth();
      if (!row || row.length < w) row = new Uint8ClampedArray(w);
      row.set(this.lum.subarray(y * w, (y + 1) * w));
      return row;
    }
    getMatrix() {
      return this.lum;
    }
  }

  const source = new CustomLuminanceSource(luminances, info.width, info.height);
  const binarizer = new zxing.HybridBinarizer(source);
  const bitmap = new zxing.BinaryBitmap(binarizer);
  const reader = new zxing.QRCodeReader();

  try {
    const result = reader.decode(bitmap);
    console.log('>>> [PASS] ZXing Successfully Decoded QR Code URL:', result.getText());
    return true;
  } catch (err) {
    console.error('>>> [FAIL] Decode failed:', err.message || err);
    return false;
  }
}

generateNormalQrWithLogo().catch(console.error);
