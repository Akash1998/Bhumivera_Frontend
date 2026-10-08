import imageCompression from 'browser-image-compression';

export default async function compressReviewImage(file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.9,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.9,
    maxIteration: 10
  });

  const filename = `${file.name.replace(/\.[^.]+$/, '')}.webp`;
  return new File([compressed], filename, {
    type: 'image/webp',
    lastModified: file.lastModified
  });
}
