const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const pngFilePath = path.resolve(__dirname, '../public/test-qr-direct.png');
const buf = fs.readFileSync(pngFilePath);
let offset = 8;
let width = 0, height = 0;
const idats = [];
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString();
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  }
  if (type === 'IDAT') idats.push(buf.slice(offset + 8, offset + 8 + len));
  offset += 12 + len;
  if (type === 'IEND') break;
}
const uncomp = zlib.inflateSync(Buffer.concat(idats));
console.log('Sample pixels from row 100:');
const bytesPerRow = width * 4 + 1;
const y = 100;
const rowStart = y * bytesPerRow + 1;
for (let x = 0; x < 20; x++) {
  const idx = rowStart + x * 4;
  console.log(`x=${x}: R=${uncomp[idx]}, G=${uncomp[idx+1]}, B=${uncomp[idx+2]}, A=${uncomp[idx+3]}`);
}
