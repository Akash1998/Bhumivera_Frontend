import { describe, expect, it } from 'vitest';
import { getCartGiftProgress } from './cartGiftProgress';

describe('cart gift progress', () => {
  it('finds the next configured gift milestone and computes progress', () => {
    const progress = getCartGiftProgress([
      { giftProductId: 7, giftProductName: 'Mini Serum', minCartValue: 500, unlocked: true },
      { giftProductId: 8, giftProductName: 'Travel Cleanser', minCartValue: 1000, unlocked: false },
      { giftProductId: null, minCartValue: 750, unlocked: false },
    ], 750);

    expect(progress.unlocked).toHaveLength(1);
    expect(progress.next.giftProductName).toBe('Travel Cleanser');
    expect(progress.target.minCartValue).toBe(1000);
    expect(progress.progressPercent).toBe(75);
  });

  it('does not present a gift threshold that has already passed its maximum cart value', () => {
    const progress = getCartGiftProgress([
      { giftProductId: 8, minCartValue: 500, maxCartValue: 700, unlocked: false },
    ], 750);

    expect(progress.next).toBeNull();
    expect(progress.target).toBeNull();
  });
});
