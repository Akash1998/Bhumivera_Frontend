import { describe, expect, it } from 'vitest';
import { estimateShoppingWalletReward } from './shoppingWalletReward';

describe('shopping wallet reward estimates', () => {
  it('estimates ten percent for returning customers', () => {
    expect(estimateShoppingWalletReward(1234.56)).toBe(123.46);
  });

  it('adds the five-percent new-customer bonus and caps the total reward', () => {
    expect(estimateShoppingWalletReward(1000, true)).toBe(150);
    expect(estimateShoppingWalletReward(10000, true)).toBe(500);
  });

  it('does not award negative or invalid eligible amounts', () => {
    expect(estimateShoppingWalletReward(-5)).toBe(0);
    expect(estimateShoppingWalletReward('not-an-amount', true)).toBe(0);
  });
});
