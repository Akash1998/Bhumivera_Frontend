const QRCode = require('qrcode');
const path = require('path');
const outPath = path.resolve(__dirname, '../public/test-qr-direct.png');

QRCode.toFile(outPath, 'https://bhumivera.com/verify?qr=8492-7105-3824', {
  errorCorrectionLevel: 'H',
  width: 600,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, (err) => {
  if (err) console.error('Error:', err);
  else console.log('Successfully generated test-qr-direct.png!');
});
