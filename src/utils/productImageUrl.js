import { BASE_URL } from '../services/api';

const DEFAULT_IMAGE_BASE =
  'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera';

const ensureR2BucketPath = url => {
  try {
    const parsed = new URL(url);
    if (/\.r2\.dev$/i.test(parsed.hostname) &&
        !parsed.pathname.replace(/\/+$/, '').endsWith('/bhumivera')) {
      parsed.pathname = `${parsed.pathname.replace(/\/+$/, '')}/bhumivera`;
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return url.replace(/\/+$/, '');
  }
};

export const getProductImageUrl = image => {
  let value = image;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      value = JSON.parse(trimmed);
    } catch {
      value = trimmed;
    }
  }

  if (Array.isArray(value)) {
    value = value.find(item => item?.type !== 'video' && item?.media_type !== 'video') ?? value[0];
  }
  if (value && typeof value === 'object') {
    value = value.url || value.image_url || value.image || value.file_path || value.path;
  }
  if (typeof value !== 'string' || !value.trim()) return null;

  const path = value.trim();
  if (/^(https?:|data:|blob:)/i.test(path)) {
    if (!/^https?:\/\//i.test(path)) return path;
    try {
      const parsed = new URL(path);
      if (/\.r2\.dev$/i.test(parsed.hostname) &&
          /^\/products\//i.test(parsed.pathname)) {
        parsed.pathname = `/bhumivera${parsed.pathname}`;
      }
      return parsed.toString();
    } catch {
      return path;
    }
  }
  if (path.startsWith('//')) return `${window.location.protocol}${path}`;

  const normalizedPath = path.replace(/^\/+/, '');
  if (normalizedPath.startsWith('uploads/')) {
    return `${BASE_URL.replace(/\/+$/, '')}/${normalizedPath}`;
  }
  if (path.startsWith('/') && !normalizedPath.startsWith('products/')) return path;

  const imageBase = ensureR2BucketPath(
    import.meta.env.VITE_R2_PUBLIC_URL ||
    import.meta.env.VITE_IMAGE_BASE_URL ||
    DEFAULT_IMAGE_BASE
  );
  const key = normalizedPath.replace(/^bhumivera\//, '');
  return `${imageBase}/${key}`;
};
