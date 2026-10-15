import { describe, expect, it } from 'vitest';
import { getProductImageUrl } from './productImageUrl';

describe('getProductImageUrl', () => {
  it('uses the API-provided URL before a product image storage key', () => {
    expect(getProductImageUrl({
      file_path: 'products/item.webp',
      url: 'https://images.example.com/item.webp',
    })).toBe('https://images.example.com/item.webp');
  });

  it('resolves product storage keys against the configured public image base', () => {
    expect(getProductImageUrl('products/item.webp')).toMatch(
      /^https:\/\/pub-70fdb5d94df347c4bed417c28b066c02\.r2\.dev\/bhumivera\/products\/item\.webp$/
    );
  });

  it('repairs older R2 URLs that omitted the bucket path', () => {
    expect(getProductImageUrl(
      'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/products/item.webp'
    )).toBe(
      'https://pub-70fdb5d94df347c4bed417c28b066c02.r2.dev/bhumivera/products/item.webp'
    );
  });

  it('resolves legacy uploads through the backend and preserves absolute URLs', () => {
    expect(getProductImageUrl('/uploads/legacy.webp')).toMatch(/\/uploads\/legacy\.webp$/);
    expect(getProductImageUrl('https://images.example.com/item.webp'))
      .toBe('https://images.example.com/item.webp');
  });

  it('selects the first non-video image in serialized image lists', () => {
    expect(getProductImageUrl(JSON.stringify([
      { url: 'https://media.example.com/video.mp4', type: 'video' },
      { file_path: 'products/item.webp' },
    ]))).toMatch(/\/products\/item\.webp$/);
  });
});
