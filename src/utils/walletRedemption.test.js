import { describe, expect, it } from 'vitest';
import { calculateReferralWalletRedemption, calculateTierDiscount } from './walletRedemption';

describe('cart wallet credit calculations', () => {
  it('caps shopping credit by balance, eligible subtotal, and the matching order tier', () => {
    const tiers = [
      { min_order_amount: 500, referral_amount: 100 },
      { min_order_amount: 1500, referral_amount: 250 },
    ];

    expect(calculateReferralWalletRedemption(250, 2000, 1700, tiers)).toBe(250);
    expect(calculateReferralWalletRedemption(80, 2000, 1700, tiers)).toBe(80);
    expect(calculateReferralWalletRedemption(250, 2000, 50, tiers)).toBe(50);
  });

  it('does not apply shopping credit below the configured order threshold', () => {
    expect(calculateReferralWalletRedemption(
      250,
      499.99,
      499.99,
      [{ min_order_amount: 500, referral_amount: 100 }],
    )).toBe(0);
  });

  it('caps tier discount by both the configured percentage and remaining subtotal', () => {
    expect(calculateTierDiscount(1000, 100, { tier_discount_percent: 5 }, true)).toBe(50);
    expect(calculateTierDiscount(100, 99, { tier_discount_percent: 5 }, true)).toBe(1);
    expect(calculateTierDiscount(1000, 0, { tier_discount_percent: 5 }, false)).toBe(0);
  });
});
