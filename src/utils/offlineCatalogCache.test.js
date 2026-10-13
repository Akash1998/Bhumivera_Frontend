import { describe, expect, it } from 'vitest';
import { getPublicCatalogCacheKey, isCacheablePublicCatalogResponse } from './offlineCatalogCache';

describe('public catalog cache keys', () => {
  it('caches only read-only public product list and detail requests', () => {
    expect(getPublicCatalogCacheKey({ url: '/products/active', method: 'get' })).toBe('/products/active');
    expect(getPublicCatalogCacheKey({ url: '/products/slug/sea-buckthorn', method: 'get' }))
      .toBe('/products/slug/sea-buckthorn');
    expect(getPublicCatalogCacheKey({ url: '/products/12345678-1234-1234-1234-123456789012', method: 'get' }))
      .toBe('/products/12345678-1234-1234-1234-123456789012');
    expect(getPublicCatalogCacheKey({ url: '/products/sea-buckthorn', method: 'get' }))
      .toBe('/products/sea-buckthorn');
    expect(getPublicCatalogCacheKey({ url: '/categories', method: 'get' })).toBe('/categories');
  });

  it('includes sorted public list parameters in cache keys', () => {
    expect(getPublicCatalogCacheKey({
      url: '/products/active',
      method: 'get',
      params: { search: 'serum', limit: 8 },
    })).toBe('/products/active?limit=8&search=serum');
  });

  it('does not cache mutations, administrative requests, or account-specific endpoints', () => {
    expect(getPublicCatalogCacheKey({ url: '/products/active', method: 'post' })).toBeNull();
    expect(getPublicCatalogCacheKey({ url: '/products', method: 'get', adminAuth: true })).toBeNull();
    expect(getPublicCatalogCacheKey({ url: '/cart', method: 'get' })).toBeNull();
    expect(getPublicCatalogCacheKey({ url: '/categories/audit/history', method: 'get' })).toBeNull();
    expect(getPublicCatalogCacheKey({ url: '/products/123/status', method: 'get' })).toBeNull();
  });

  it('does not persist inactive or error-shaped product detail responses', () => {
    expect(isCacheablePublicCatalogResponse('/products/123', { data: { status: 'inactive' } })).toBe(false);
    expect(isCacheablePublicCatalogResponse('/products/slug/serum', { success: false })).toBe(false);
    expect(isCacheablePublicCatalogResponse('/products/active', { success: true, data: [] })).toBe(true);
  });
});
