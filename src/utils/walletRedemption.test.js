import { describe, expect, it } from 'vitest';
import { calculateReferralWalletRedemption, calculateTierDiscount } from './walletRedemption';

describe('cart wallet credit calculations', () => {
  it('caps shopping credit by balance, eligible subtotal, and the matching order tier', () => {
    const tiers = [
      { min_order_amount: 799, referral_amount: 100 },
      { min_order_amount: 1499, referral_amount: 250 },
    ];

    expect(calculateReferralWalletRedemption(250, 999, 999, tiers)).toBe(100);
    expect(calculateReferralWalletRedemption(80, 999, 999, tiers)).toBe(80);
    expect(calculateReferralWalletRedemption(250, 2000, 1700, tiers)).toBe(250);
    expect(calculateReferralWalletRedemption(250, 2000, 50, tiers)).toBe(50);
  });

  it('does not apply shopping credit below the configured order threshold', () => {
    const tiers = [{ min_order_amount: 799, referral_amount: 100 }];
    expect(calculateReferralWalletRedemption(250, 798.99, 798.99, tiers)).toBe(0);
    expect(calculateReferralWalletRedemption(250, 599, 599, tiers)).toBe(0);
  });

  it('caps tier discount by both the configured percentage and remaining subtotal', () => {
    expect(calculateTierDiscount(1000, 100, { tier_discount_percent: 5 }, true)).toBe(50);
    expect(calculateTierDiscount(100, 99, { tier_discount_percent: 5 }, true)).toBe(1);
    expect(calculateTierDiscount(1000, 0, { tier_discount_percent: 5 }, false)).toBe(0);
  });
});
