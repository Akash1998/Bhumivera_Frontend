const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const zxing = require('@zxing/library');

// Read PNG and parse IDAT to get raw RGBA pixels
const pngPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.png');
const buf = fs.readFileSync(pngPath);

let offset = 8;
let width = 0;
let height = 0;
const idats = [];

while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString();
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  }
  if (type === 'IDAT') {
    idats.push(buf.slice(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
  if (type === 'IEND') break;
}

const uncomp = zlib.inflateSync(Buffer.concat(idats));
console.log('Image dimensions:', width, 'x', height, 'Raw scanlines length:', uncomp.length);

// Convert PNG scanlines (each row starts with 1-byte filter) to 32-bit luminance array
const luminances = new Uint8ClampedArray(width * height);
const bytesPerRow = width * 4 + 1;

for (let y = 0; y < height; y++) {
  const rowStart = y * bytesPerRow + 1;
  for (let x = 0; x < width; x++) {
    const idx = rowStart + x * 4;
    const r = uncomp[idx];
    const g = uncomp[idx + 1];
    const b = uncomp[idx + 2];
    // Luminance formula
    luminances[y * width + x] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
}

// Pass to ZXing RGBLuminanceSource
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

const source = new CustomLuminanceSource(luminances, width, height);
const binarizer = new zxing.HybridBinarizer(source);
const bitmap = new zxing.BinaryBitmap(binarizer);
const reader = new zxing.QRCodeReader();

try {
  const result = reader.decode(bitmap);
  console.log('SUCCESS! ZXing Scanned QR Code Result:', result.getText());
} catch (decodeErr) {
  console.error('Decode failed:', decodeErr.message || decodeErr);
}
