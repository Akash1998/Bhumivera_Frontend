const sharp = require('sharp');
const zxing = require('@zxing/library');
const path = require('path');

async function testSharpDecode(imagePath) {
  console.log('Testing decode of:', imagePath);
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Dimensions: ${info.width}x${info.height}, Channels: ${info.channels}`);

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
    console.log('>>> SUCCESS! Scanned QR Code Result:', result.getText());
    return true;
  } catch (err) {
    console.error('>>> Decode failed:', err.message || err);
    return false;
  }
}

testSharpDecode(path.resolve(__dirname, '../public/test-qr-direct.png'));
