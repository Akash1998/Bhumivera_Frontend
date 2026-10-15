import { describe, expect, it } from 'vitest';
import { getProductImageUrl } from './productImage';

const publicImageUrl = 'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera/products/face-wash.webp';

describe('getProductImageUrl', () => {
  it('prefers the canonical URL returned with a product image record', () => {
    expect(getProductImageUrl({
      file_path: 'products/face-wash.webp',
      url: publicImageUrl,
    })).toBe(publicImageUrl);
  });

  it('adds the bucket prefix to relative R2 object keys', () => {
    expect(getProductImageUrl('products/face-wash.webp')).toBe(publicImageUrl);
  });

  it('repairs legacy R2 URLs missing the bucket prefix', () => {
    expect(getProductImageUrl(
      'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/products/face-wash.webp'
    )).toBe(publicImageUrl);
  });

  it('parses serialized image records and returns the requested fallback for empty values', () => {
    expect(getProductImageUrl(JSON.stringify({ file_path: 'products/face-wash.webp' })))
      .toBe(publicImageUrl);
    expect(getProductImageUrl(null, { fallback: null })).toBeNull();
  });

  it('supports serialized image arrays and inline image URLs', () => {
    expect(getProductImageUrl(JSON.stringify(['products/face-wash.webp']))).toBe(publicImageUrl);
    expect(getProductImageUrl('data:image/webp;base64,abc')).toBe('data:image/webp;base64,abc');
  });
});
