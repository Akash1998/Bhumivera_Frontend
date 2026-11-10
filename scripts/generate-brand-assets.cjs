const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'public', 'LOGO.png');
const webpOptions = { quality: 82, alphaQuality: 100, effort: 6 };
const background = { r: 20, g: 37, b: 28, alpha: 1 };

const createFavicon = async () => {
  const sizes = [16, 32, 48, 64, 128, 256];
  const images = await Promise.all(sizes.map(size => {
    const padding = Math.round(size * 0.04);
    return sharp(source)
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain' })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  }));
  const headerSize = 6 + sizes.length * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  let offset = headerSize;
  images.forEach((image, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry);
    header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(image.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += image.length;
  });

  await fs.promises.writeFile(path.join(root, 'public', 'favicon.ico'), Buffer.concat([header, ...images]));
};

const createPwaIcon = async (size, fileName = `icon-${size}.png`) => {
  const logoSize = Math.round(size * 0.72);
  const logo = await sharp(source)
    .resize(logoSize, logoSize, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(path.join(root, 'public', fileName));
};

const fixAdaptiveIconBackgrounds = async () => {
  const launcherIcon = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground>
        <inset android:drawable="@mipmap/ic_launcher_foreground" android:inset="16.7%" />
    </foreground>
</adaptive-icon>
`;
  const iconDirectory = path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-anydpi-v26');

  await Promise.all(['ic_launcher.xml', 'ic_launcher_round.xml'].map(file =>
    fs.promises.writeFile(path.join(iconDirectory, file), launcherIcon)
  ));
};

const main = async () => {
  if (process.argv.includes('--fix-adaptive-icons')) {
    await fixAdaptiveIconBackgrounds();
    return;
  }

  if (!fs.existsSync(source)) {
    throw new Error(`Brand logo source is missing: ${source}`);
  }

  await Promise.all([
    sharp(source).webp(webpOptions).toFile(path.join(root, 'public', 'logo.webp')),
    sharp(source).webp(webpOptions).toFile(path.join(root, 'resources', 'logo.webp')),
    fs.promises.copyFile(source, path.join(root, 'resources', 'logo.png')),
    createPwaIcon(192),
    createPwaIcon(512),
    createPwaIcon(512, 'icon-maskable-512.png'),
    createFavicon(),
  ]);
};

main().catch(error => {
  console.error('[BRAND_ASSETS]', error);
  process.exitCode = 1;
});
