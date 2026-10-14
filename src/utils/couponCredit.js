export const COUPON_CREDIT_PERCENT = 10;
export const COUPON_CREDIT_CAP = 500;
export const COUPON_CREDIT_VALID_DAYS = 90;

export const estimateCouponCredit = eligibleSubtotal => Math.round(
  (Math.min(
    COUPON_CREDIT_CAP,
    Math.max(0, Number(eligibleSubtotal) || 0) * COUPON_CREDIT_PERCENT / 100,
  ) + Number.EPSILON) * 100,
) / 100;
