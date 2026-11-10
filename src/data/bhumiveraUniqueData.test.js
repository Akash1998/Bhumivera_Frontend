import { describe, expect, it } from 'vitest';
import { FALLBACK_CATALOG_PRODUCTS } from './bhumiveraUniqueData';

describe('fallback catalog purchase availability', () => {
  it('uses the active catalog IDs and prices for the purchasable fallback products', () => {
    expect(FALLBACK_CATALOG_PRODUCTS.slice(0, 2).map(({ id, discount_price }) => [id, discount_price])).toEqual([
      [8, 399],
      [9, 299],
    ]);
  });

  it('marks products absent from the live catalog as unavailable', () => {
    expect(FALLBACK_CATALOG_PRODUCTS.slice(2).every(({ inStock }) => inStock === false)).toBe(true);
  });
});
