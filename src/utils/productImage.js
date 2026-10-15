const DEFAULT_IMAGE_BASE = 'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera';

const normalizeImageUrl = value => {
  if (/^(https?:|data:|blob:)/i.test(value)) {
    if (!/^https?:\/\//i.test(value)) return value;
    try {
      const url = new URL(value);
      if (/\.r2\.dev$/i.test(url.hostname) &&
          /^\/products\//i.test(url.pathname)) {
        url.pathname = `/bhumivera${url.pathname}`;
      }
      return url.toString();
    } catch {
      return value;
    }
  }

  const configuredBase = import.meta.env.VITE_R2_PUBLIC_URL ||
    import.meta.env.VITE_IMAGE_BASE_URL ||
    DEFAULT_IMAGE_BASE;
  let base = configuredBase.replace(/\/+$/, '');
  if (/\.r2\.dev$/i.test(base)) base += '/bhumivera';

  if (/^uploads\//i.test(value)) {
    const apiBase = import.meta.env.VITE_BASE_URL || 'https://service.bhumivera.com';
    return `${apiBase.replace(/\/+$/, '')}/${value.replace(/^\/+/, '')}`;
  }

  const path = value.replace(/^\/+/, '');
  return `${base}/${path.replace(/^bhumivera\//i, '')}`;
};

export const getProductImageUrl = (image, { fallback = '/logo.webp' } = {}) => {
  let value = image;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      // Plain URLs and object-storage keys are expected image values.
    }
  }

  const images = Array.isArray(value) ? value : [value];
  for (const imageValue of images) {
    const candidates = typeof imageValue === 'object' && imageValue !== null
      ? [imageValue.url, imageValue.file_path, imageValue.path]
      : [imageValue];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return normalizeImageUrl(candidate.trim());
      }
    }
  }

  return fallback;
};
