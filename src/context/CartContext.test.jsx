import { describe, expect, it } from 'vitest';
import { getCartProductId } from './CartContext';
import { getClientStockError } from '../utils/cartStock';

describe('cart product IDs', () => {
  it('uses the product ID instead of the cart-row ID for cart API rows', () => {
    expect(getCartProductId({ id: 91, product_id: 24 })).toBe(24);
  });

  describe('cart stock validation', () => {
    it('does not reject customer additions using potentially stale browser inventory', () => {
      expect(getClientStockError({ name: 'Oil', quantity: 0 }, 0, 1, true)).toBeNull();
      expect(getClientStockError({ name: 'Oil', stock: 1 }, 1, 1, true)).toBeNull();
    });

    it('keeps the stock guard for guest carts without a live server check', () => {
      expect(getClientStockError({ name: 'Oil', quantity: 0 }, 0, 1))
        .toBe('Oil is currently out of stock.');
      expect(getClientStockError({ name: 'Oil', stock: 1 }, 1, 1))
        .toBe('Only 1 unit(s) of Oil available in stock.');
    });
  });

  it('supports product objects with either common product ID field', () => {
    expect(getCartProductId({ _id: 25, id: 26 })).toBe(25);
    expect(getCartProductId({ id: 27 })).toBe(27);
  });
});
