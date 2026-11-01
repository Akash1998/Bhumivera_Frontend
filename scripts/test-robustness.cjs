const sharp = require('sharp');
const zxing = require('@zxing/library');
const path = require('path');

async function testResolutionRobustness() {
  const qrPngPath = path.resolve(__dirname, '../public/bhumivera-gift-qr.png');
  const sizes = [900, 600, 400, 300, 200];

  for (const sz of sizes) {
    const resizedBuf = await sharp(qrPngPath)
      .resize(sz, sz)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const luminances = new Uint8ClampedArray(sz * sz);
    for (let i = 0; i < luminances.length; i++) {
      const r = resizedBuf.data[i * 4];
      const g = resizedBuf.data[i * 4 + 1];
      const b = resizedBuf.data[i * 4 + 2];
      luminances[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    }

    class CustomLuminanceSource extends zxing.LuminanceSource {
      constructor(lum, w, h) { super(w, h); this.lum = lum; }
      getRow(y, row) {
        const w = this.getWidth();
        if (!row || row.length < w) row = new Uint8ClampedArray(w);
        row.set(this.lum.subarray(y * w, (y + 1) * w));
        return row;
      }
      getMatrix() { return this.lum; }
    }

    const source = new CustomLuminanceSource(luminances, sz, sz);
    const binarizer = new zxing.HybridBinarizer(source);
    const bitmap = new zxing.BinaryBitmap(binarizer);
    const reader = new zxing.QRCodeReader();

    try {
      const result = reader.decode(bitmap);
      console.log(`[PASS] Size ${sz}x${sz} decoded: ${result.getText()}`);
    } catch (err) {
      console.error(`[FAIL] Size ${sz}x${sz} decode failed: ${err.message}`);
    }
  }
}

testResolutionRobustness().catch(console.error);
