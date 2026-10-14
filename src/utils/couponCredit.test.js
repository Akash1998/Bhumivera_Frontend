import { describe, expect, it } from 'vitest';
import { estimateCouponCredit } from './couponCredit';

describe('coupon credit estimates', () => {
  it('estimates ten percent of the eligible paid merchandise amount', () => {
    expect(estimateCouponCredit(1234.56)).toBe(123.46);
  });

  it('caps credit at five hundred rupees and handles invalid amounts safely', () => {
    expect(estimateCouponCredit(10000)).toBe(500);
    expect(estimateCouponCredit(-5)).toBe(0);
    expect(estimateCouponCredit('not-an-amount')).toBe(0);
  });
});
