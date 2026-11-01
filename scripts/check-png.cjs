const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('C:/Users/akash/OneDrive/Documents/GitHub/Bhumivera_Frontend/public/bhumivera-gift-qr.png');
let offset = 8, idats = [];
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset+4, offset+8).toString();
  if (type === 'IDAT') idats.push(buf.slice(offset+8, offset+8+len));
  offset += 12 + len;
  if (type === 'IEND') break;
}
const raw = zlib.inflateSync(Buffer.concat(idats));
let blacks = 0, whites = 0, others = 0;
for (let i = 0; i < raw.length; i += 4) {
  const r = raw[i], g = raw[i+1], b = raw[i+2];
  if (r < 50 && g < 50 && b < 50) blacks++;
  else if (r > 200 && g > 200 && b > 200) whites++;
  else others++;
}
console.log({ blacks, whites, others, total: raw.length / 4 });
