import { describe, expect, it, vi } from 'vitest';
import { resolveCheckoutPromo } from './resolveCheckoutPromo';

describe('resolveCheckoutPromo', () => {
  it('tries a creator offer when the code is not a store coupon', async () => {
    const couponError = { response: { data: { code: 'COUPON_INVALID', message: 'Invalid coupon code.' } } };
    const validateCoupon = vi.fn().mockRejectedValue(couponError);
    const applyAffiliateCode = vi.fn().mockResolvedValue(undefined);

    await expect(resolveCheckoutPromo({
      code: 'CREATOR20',
      validateCoupon,
      applyAffiliateCode,
    })).resolves.toEqual({ type: 'creator' });

    expect(validateCoupon).toHaveBeenCalledWith('CREATOR20');
    expect(applyAffiliateCode).toHaveBeenCalledWith('CREATOR20');
  });

  it('does not reinterpret an ineligible store coupon as a creator offer', async () => {
    const couponError = { response: { data: { code: 'COUPON_MIN_ORDER_NOT_MET', message: 'Minimum not met.' } } };
    const applyAffiliateCode = vi.fn();

    await expect(resolveCheckoutPromo({
      code: 'STORE20',
      validateCoupon: vi.fn().mockRejectedValue(couponError),
      applyAffiliateCode,
    })).rejects.toBe(couponError);

    expect(applyAffiliateCode).not.toHaveBeenCalled();
  });

  it('preserves the regular coupon error when no creator code matches', async () => {
    const couponError = { response: { data: { code: 'COUPON_INVALID', message: 'Invalid coupon code.' } } };

    await expect(resolveCheckoutPromo({
      code: 'UNKNOWN',
      validateCoupon: vi.fn().mockRejectedValue(couponError),
      applyAffiliateCode: vi.fn().mockRejectedValue({
        response: { status: 404, data: { code: 'PROMOTER_CODE_INVALID' } },
      }),
    })).rejects.toBe(couponError);
  });
});
