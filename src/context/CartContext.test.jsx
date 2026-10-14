import { describe, expect, it } from 'vitest';
import { getCartProductId } from './CartContext';

describe('cart product IDs', () => {
  it('uses the product ID instead of the cart-row ID for cart API rows', () => {
    expect(getCartProductId({ id: 91, product_id: 24 })).toBe(24);
  });

  it('supports product objects with either common product ID field', () => {
    expect(getCartProductId({ _id: 25, id: 26 })).toBe(25);
    expect(getCartProductId({ id: 27 })).toBe(27);
  });
});
