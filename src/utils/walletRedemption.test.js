import { describe, expect, it } from 'vitest';
import { calculateReferralWalletRedemption, calculateTierDiscount } from './walletRedemption';

describe('cart wallet credit calculations', () => {
  it('allows maximum ₹100 welcome bonus for orders from ₹799 to ₹999, and referral is not eligible', () => {
    // Customer has ₹300 welcome bonus + ₹200 referral balance (total ₹500)
    const totalBalance = 500;
    const welcomeBonus = 300;

    // At ₹799: only welcome bonus up to ₹100
    expect(calculateReferralWalletRedemption(totalBalance, 799, 799, [], welcomeBonus)).toBe(100);

    // At ₹999: only welcome bonus up to ₹100 (referral not eligible below 1000)
    expect(calculateReferralWalletRedemption(totalBalance, 999, 999, [], welcomeBonus)).toBe(100);

    // If customer has only referral balance (no welcome bonus) at ₹999: gets ₹0
    expect(calculateReferralWalletRedemption(200, 999, 999, [], 0)).toBe(0);
  });

  it('allows ₹100 welcome bonus + ₹100 referral balance (₹200 total) above ₹999', () => {
    const totalBalance = 500; // ₹300 welcome + ₹200 referral
    const welcomeBonus = 300;

    // Order of ₹1,200 (above ₹999): ₹100 welcome + ₹100 referral = ₹200
    expect(calculateReferralWalletRedemption(totalBalance, 1200, 1200, [], welcomeBonus)).toBe(200);

    // Order of ₹1,200 with only referral balance (no welcome bonus): gets ₹100
    expect(calculateReferralWalletRedemption(200, 1200, 1200, [], 0)).toBe(100);

    // Order of ₹1,200 with only welcome bonus (no referral balance): gets ₹100
    expect(calculateReferralWalletRedemption(300, 1200, 1200, [], 300)).toBe(100);
  });

  it('does not apply any shopping / gift credit below ₹799', () => {
    expect(calculateReferralWalletRedemption(500, 798.99, 798.99, [], 300)).toBe(0);
    expect(calculateReferralWalletRedemption(500, 599, 599, [], 300)).toBe(0);
  });

  it('caps tier discount by both the configured percentage and remaining subtotal', () => {
    expect(calculateTierDiscount(1000, 100, { tier_discount_percent: 5 }, true)).toBe(50);
    expect(calculateTierDiscount(100, 99, { tier_discount_percent: 5 }, true)).toBe(1);
    expect(calculateTierDiscount(1000, 0, { tier_discount_percent: 5 }, false)).toBe(0);
  });
});
